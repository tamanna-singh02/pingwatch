import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import {
  SignupSchema,
  LoginSchema,
  RefreshSchema,
  type SignupInput,
  type LoginInput,
  type RefreshInput,
} from "@pingwatch/shared-types";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser, type AuthenticatedUser } from "../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  signup(@Body(new ZodValidationPipe(SignupSchema)) body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post("login")
  login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginInput) {
    return this.authService.login(body);
  }

  @Post("refresh")
  refresh(@Body(new ZodValidationPipe(RefreshSchema)) body: RefreshInput) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post("logout")
  logout(@Body(new ZodValidationPipe(RefreshSchema)) body: RefreshInput) {
    return this.authService.logout(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return { user };
  }
}
