import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { nanoid } from "nanoid";
import type { InviteMemberInput } from "@pingwatch/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";

const INVITE_TTL_DAYS = 7;

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  // Every method here takes the caller's tenant context and filters by it
  // explicitly — this is the "app layer" half of the two-layer isolation
  // strategy from the design doc (Postgres RLS is the hardening pass to
  // add before onboarding real customer data).

  async getCurrentOrg(actor: AuthenticatedUser) {
    const org = await this.prisma.organization.findUnique({
      where: { id: actor.orgId },
    });
    if (!org) throw new NotFoundException("Organization not found");
    return org;
  }

  async listMembers(actor: AuthenticatedUser) {
    return this.prisma.membership.findMany({
      where: { orgId: actor.orgId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async listInvites(actor: AuthenticatedUser) {
    return this.prisma.invite.findMany({
      where: { orgId: actor.orgId, acceptedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  async inviteMember(actor: AuthenticatedUser, input: InviteMemberInput) {
    const email = input.email.toLowerCase();

    const alreadyMember = await this.prisma.membership.findFirst({
      where: { orgId: actor.orgId, user: { email } },
    });
    if (alreadyMember) {
      throw new ConflictException("This person is already a member of the organization");
    }

    const invite = await this.prisma.invite.upsert({
      where: { orgId_email: { orgId: actor.orgId, email } },
      create: {
        orgId: actor.orgId,
        email,
        role: input.role,
        token: nanoid(32),
        expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
      },
      update: {
        role: input.role,
        token: nanoid(32),
        expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000),
        acceptedAt: null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        orgId: actor.orgId,
        actorId: actor.id,
        action: "member.invited",
        metadata: { email, role: input.role },
      },
    });

    // Phase 4 (Alerting) introduces the notifier service with real email
    // adapters — wire this up to send the invite link then. For now the
    // token is returned directly so the flow is testable end to end.
    return invite;
  }

  async acceptInvite(actor: AuthenticatedUser, token: string) {
    const invite = await this.prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
      throw new BadRequestException("This invite is invalid or has expired");
    }
    if (invite.email !== actor.email.toLowerCase()) {
      throw new BadRequestException("This invite was sent to a different email address");
    }

    const [membership] = await this.prisma.$transaction([
      this.prisma.membership.create({
        data: { userId: actor.id, orgId: invite.orgId, role: invite.role },
      }),
      this.prisma.invite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          orgId: invite.orgId,
          actorId: actor.id,
          action: "member.joined",
          metadata: { via: "invite" },
        },
      }),
    ]);

    return membership;
  }

  async removeMember(actor: AuthenticatedUser, membershipId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
    });
    if (!membership || membership.orgId !== actor.orgId) {
      throw new NotFoundException("Member not found");
    }
    if (membership.role === "OWNER") {
      throw new BadRequestException("The organization owner cannot be removed");
    }

    await this.prisma.membership.delete({ where: { id: membershipId } });
    await this.prisma.auditLog.create({
      data: {
        orgId: actor.orgId,
        actorId: actor.id,
        action: "member.removed",
        metadata: { removedMembershipId: membershipId },
      },
    });
  }
}
