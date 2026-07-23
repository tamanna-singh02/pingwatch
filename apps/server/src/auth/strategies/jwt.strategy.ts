import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import type { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

export interface AccessTokenPayload {
  sub: string; // userId
  email: string;
  name: string;
  orgId: string;
  orgSlug: string;
  role: AuthenticatedUser["role"];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
    });
  }

  // NOTE: we trust the org/role claims embedded in the (short-lived, 15min)
  // access token rather than re-querying the DB on every request, for
  // latency. A role change or removal from an org takes effect on the next
  // token refresh at the latest. If you need instant revocation, check
  // membership here instead — at the cost of a DB round-trip per request.
  async validate(payload: AccessTokenPayload): Promise<AuthenticatedUser> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      orgId: payload.orgId,
      orgSlug: payload.orgSlug,
      role: payload.role,
    };
  }
}
