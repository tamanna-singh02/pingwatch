import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InviteMemberSchema, type InviteMemberInput } from "@pingwatch/shared-types";
import { OrganizationsService } from "./organizations.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser, type AuthenticatedUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("organizations/current")
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Get()
  getCurrent(@CurrentUser() user: AuthenticatedUser) {
    return this.orgsService.getCurrentOrg(user);
  }

  @Get("members")
  listMembers(@CurrentUser() user: AuthenticatedUser) {
    return this.orgsService.listMembers(user);
  }

  @Get("invites")
  @Roles("OWNER", "ADMIN")
  listInvites(@CurrentUser() user: AuthenticatedUser) {
    return this.orgsService.listInvites(user);
  }

  @Post("invites")
  @Roles("OWNER", "ADMIN")
  invite(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(InviteMemberSchema)) body: InviteMemberInput,
  ) {
    return this.orgsService.inviteMember(user, body);
  }

  @Post("invites/:token/accept")
  acceptInvite(@CurrentUser() user: AuthenticatedUser, @Param("token") token: string) {
    return this.orgsService.acceptInvite(user, token);
  }

  @Delete("members/:membershipId")
  @Roles("OWNER", "ADMIN")
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param("membershipId") membershipId: string,
  ) {
    return this.orgsService.removeMember(user, membershipId);
  }
}
