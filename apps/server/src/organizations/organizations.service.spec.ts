import { NotFoundException } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import type { AuthenticatedUser } from "../common/decorators/current-user.decorator";

// A minimal fake of PrismaService covering only what this spec touches.
// This test exists specifically to prove the tenant-isolation milestone
// from the roadmap: a user in org A cannot act on org B's data, even by
// guessing an id, because every service method filters by actor.orgId.
function makeFakePrisma(membership: { id: string; orgId: string; role: string } | null) {
  return {
    membership: {
      findUnique: jest.fn().mockResolvedValue(membership),
      delete: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  } as any;
}

const actorInOrgA: AuthenticatedUser = {
  id: "user-a",
  email: "a@example.com",
  name: "A",
  orgId: "org-a",
  orgSlug: "org-a",
  role: "ADMIN",
};

describe("OrganizationsService — tenant isolation", () => {
  it("refuses to remove a membership that belongs to a different org", async () => {
    const membershipInOrgB = { id: "mem-1", orgId: "org-b", role: "VIEWER" };
    const prisma = makeFakePrisma(membershipInOrgB);
    const service = new OrganizationsService(prisma);

    await expect(service.removeMember(actorInOrgA, "mem-1")).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(prisma.membership.delete).not.toHaveBeenCalled();
  });

  it("allows removing a membership that belongs to the caller's own org", async () => {
    const membershipInOrgA = { id: "mem-2", orgId: "org-a", role: "VIEWER" };
    const prisma = makeFakePrisma(membershipInOrgA);
    const service = new OrganizationsService(prisma);

    await service.removeMember(actorInOrgA, "mem-2");
    expect(prisma.membership.delete).toHaveBeenCalledWith({ where: { id: "mem-2" } });
  });
});
