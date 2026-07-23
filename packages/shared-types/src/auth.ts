import { z } from "zod";

/**
 * These schemas are the single source of truth for auth payload shapes.
 * The NestJS API validates incoming requests against them, and the React
 * app can use them for client-side form validation, so both sides can
 * never drift out of sync.
 */

export const SignupSchema = z.object({
  organizationName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(128),
  name: z.string().min(1).max(100),
});
export type SignupInput = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshInput = z.infer<typeof RefreshSchema>;

export const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const RoleEnum = z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]);
export type Role = z.infer<typeof RoleEnum>;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  orgId: string;
  orgSlug: string;
  role: Role;
}

export interface AuthResponse extends AuthTokens {
  user: SessionUser;
}
