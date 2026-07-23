import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Every protected controller/route uses this guard. It runs JwtStrategy,
// which populates request.user with { id, orgId, orgSlug, role } —
// the tenant context every downstream query must be scoped by.
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
