import { SetMetadata } from "@nestjs/common";
import type { Role } from "@pingwatch/database";

export const ROLES_KEY = "roles";

/**
 * Marks a route as requiring one of the given roles, checked by RolesGuard
 * against the tenant context attached by JwtAuthGuard.
 * Usage: @Roles("OWNER", "ADMIN")
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
