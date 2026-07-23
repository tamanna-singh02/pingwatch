# PingWatch — Phase 1: Auth & Multi-Tenancy

This is the working codebase for **Phase 1** of the [build roadmap](./ROADMAP.md):
signup, login, JWT auth with refresh-token rotation, org creation, team
invites, RBAC (Owner/Admin/Editor/Viewer), and tenant-scoped queries end to
end between a NestJS API and a React + TypeScript frontend.

## Stack

- **Frontend:** Vite + React + TypeScript, React Router, TanStack Query
- **Backend:** NestJS, Prisma, PostgreSQL, Passport JWT, argon2
- **Shared:** Zod schemas in `packages/shared-types` used by both sides, so
  a change to the signup payload shape is a compile error on both ends
  instead of a runtime surprise.

## Project layout

```
pingwatch/
├── apps/
│   ├── server/           # NestJS API (auth, organizations modules)
│   └── client/           # React + TS dashboard
├── packages/
│   ├── database/         # Prisma schema + generated client
│   └── shared-types/     # Zod schemas shared by client + server
└── docker-compose.yml    # Postgres + Redis for local dev
```

Redis is included in docker-compose now even though Phase 1 doesn't use it
yet — Phase 2 (monitors + scheduler) needs it immediately, no reason to add
it later.

## Setup

```bash
# 1. Install dependencies (from repo root)
pnpm install

# 2. Start Postgres + Redis
pnpm docker:up

# 3. Configure env files
cp packages/database/.env.example packages/database/.env
cp apps/server/.env.example apps/server/.env
cp apps/client/.env.example apps/client/.env

# 4. Generate Prisma client + run the first migration
pnpm db:generate
pnpm db:migrate

# 5. Run both apps (separate terminals)
pnpm dev:server   # http://localhost:3001/api
pnpm dev:client   # http://localhost:5173
```

Then open http://localhost:5173/signup and create an account — this
auto-creates your organization and logs you in as its Owner.

## What's actually implemented

- **Signup** → creates `Organization` + `User` + `Membership(role=OWNER)`
  in one transaction, returns an access + refresh token pair.
- **Login** → argon2 password verification, same tokens.
- **Refresh** → refresh tokens are stored server-side as a SHA-256 hash and
  rotated on every use (old one revoked, new one issued). The web app
  refreshes silently on page load and transparently retries any request
  that gets a 401.
- **Tenant context** → the JWT carries `orgId` + `role`; every protected
  route reads it via the `@CurrentUser()` decorator and every service
  method filters Prisma queries by it explicitly.
- **RBAC** → `@Roles("OWNER", "ADMIN")` + `RolesGuard` protect
  member-management endpoints.
- **Invites** → Owner/Admin can invite a teammate by email + role; the
  invite token is returned directly by the API for now (Phase 4's notifier
  service is what actually emails it).
- **Tenant isolation test** — `organizations.service.spec.ts` proves a
  membership id from another org can't be acted on, which was called out
  as the Phase 1 milestone in the roadmap.

## What's intentionally deferred

- **Postgres Row-Level Security** — the design doc's "belt and suspenders"
  second layer. App-layer scoping (every query filtered by `orgId` from the
  verified JWT) is the primary defense and is fully in place; add RLS
  policies as a hardening pass before real customer data goes in (tracked
  in the roadmap's Phase 7).
- **Refresh token in an httpOnly cookie** instead of `localStorage` — noted
  inline in `apps/web/src/lib/api-client.ts`. Fine for local development,
  worth fixing before a public deploy.
- **SSO/WorkOS, MFA enforcement** — the `mfaEnabled` column exists on
  `User` but nothing sets it yet; both are later-phase / paid-tier items
  per the roadmap.

## Next

Phase 2 (Monitors + single-region checking) builds directly on this: new
`Monitor` and `CheckResult` Prisma models, a `MonitorsModule` reusing the
same `JwtAuthGuard` + `CurrentUser` tenant context, and a `scheduler` +
`worker` app added to `apps/`.
