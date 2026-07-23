import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { createHash } from "crypto";
import type { SignupInput, LoginInput, AuthResponse } from "@pingwatch/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { slugify } from "../common/utils/slugify";
import type { AccessTokenPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(input: SignupInput): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    const slug = await this.uniqueSlug(input.organizationName);
    const passwordHash = await argon2.hash(input.password);

    // Org + user + OWNER membership created together — this is Flow A from
    // the design doc: "org (tenant) auto-created" on signup.
    const { user, org, membership } = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: input.organizationName, slug },
      });
      const user = await tx.user.create({
        data: {
          email: input.email.toLowerCase(),
          passwordHash,
          name: input.name,
        },
      });
      const membership = await tx.membership.create({
        data: { userId: user.id, orgId: org.id, role: "OWNER" },
      });
      await tx.auditLog.create({
        data: {
          orgId: org.id,
          actorId: user.id,
          action: "org.created",
          metadata: { via: "signup" },
        },
      });
      return { user, org, membership };
    });

    return this.issueTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
      orgId: org.id,
      orgSlug: org.slug,
      role: membership.role,
    });
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { memberships: { include: { org: true }, orderBy: { createdAt: "asc" } } },
    });

    // Same error for "no user" and "wrong password" — don't leak which one.
    const invalidCreds = () => new UnauthorizedException("Invalid email or password");
    if (!user) throw invalidCreds();

    const passwordOk = await argon2.verify(user.passwordHash, input.password);
    if (!passwordOk) throw invalidCreds();

    const membership = user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException("This account is not attached to any organization");
    }

    return this.issueTokens({
      userId: user.id,
      email: user.email,
      name: user.name,
      orgId: membership.orgId,
      orgSlug: membership.org.slug,
      role: membership.role,
    });
  }

  async refresh(rawRefreshToken: string): Promise<AuthResponse> {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { memberships: { include: { org: true } } } } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }

    // Rotate: revoke the presented token so it can't be replayed, issue a
    // fresh pair. If a revoked token is ever presented again, that's a sign
    // of token theft — a production build should treat this as an incident
    // and revoke the whole session family.
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const membership = stored.user.memberships[0];
    if (!membership) {
      throw new UnauthorizedException("This account is not attached to any organization");
    }

    return this.issueTokens({
      userId: stored.user.id,
      email: stored.user.email,
      name: stored.user.name,
      orgId: membership.orgId,
      orgSlug: membership.org.slug,
      role: membership.role,
    });
  }

  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueTokens(claims: {
    userId: string;
    email: string;
    name: string;
    orgId: string;
    orgSlug: string;
    role: AccessTokenPayload["role"];
  }): Promise<AuthResponse> {
    const payload: AccessTokenPayload = {
      sub: claims.userId,
      email: claims.email,
      name: claims.name,
      orgId: claims.orgId,
      orgSlug: claims.orgSlug,
      role: claims.role,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get("JWT_ACCESS_TTL", "15m"),
    });

    const refreshToken = await this.jwt.signAsync(
      { sub: claims.userId },
      {
        secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
        expiresIn: this.config.get("JWT_REFRESH_TTL", "30d"),
      },
    );

    const ttlDays = this.parseDays(this.config.get("JWT_REFRESH_TTL", "30d"));
    await this.prisma.refreshToken.create({
      data: {
        userId: claims.userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: claims.userId,
        email: claims.email,
        name: claims.name,
        orgId: claims.orgId,
        orgSlug: claims.orgSlug,
        role: claims.role,
      },
    };
  }

  private hashToken(token: string): string {
    // Refresh tokens are stored as a SHA-256 hash, never in plaintext —
    // same principle as a password hash, so a DB leak doesn't hand out
    // live sessions.
    return createHash("sha256").update(token).digest("hex");
  }

  private parseDays(ttl: string): number {
    const match = /^(\d+)d$/.exec(ttl);
    return match ? Number(match[1]) : 30;
  }

  private async uniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let candidate = base;
    let suffix = 1;
    // Small tables, small org creation volume — a loop is fine here.
    while (await this.prisma.organization.findUnique({ where: { slug: candidate } })) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
    return candidate;
  }
}
