import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Role } from "@pingwatch/database";

/**
 * This is the tenant context: every JWT-authenticated request carries the
 * user's id, which org they're acting as, and their role in that org.
 * Every org-scoped query in the app should be filtered using req.user.orgId
 * pulled from here — never trust an orgId passed in the request body/query.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  orgId: string;
  orgSlug: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
