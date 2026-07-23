# PingWatch — Build Roadmap
### React + TypeScript (Vite SPA) frontend · NestJS + PostgreSQL backend

This roadmap adapts the original system design (which specced Next.js + Timescale + Kafka + K8s) to your stack and to something a solo/small team can actually ship incrementally. The core architecture ideas from the design doc — modular monolith, tenant isolation, quorum-based incident detection, queue-driven workers — are all preserved. The heavy infra (Kafka, Kubernetes, multi-region workers, Timescale) is pushed to a later "scale-out" phase, not day one.

**Adaptation decisions from the original doc:**
- Next.js dashboard → **Vite + React + TypeScript SPA**, React Router, TanStack Query for server state.
- Postgres does double duty for both relational data *and* check-result history at first (no Timescale/ClickHouse until you actually have volume — plain Postgres with a partitioned table handles millions of rows fine).
- BullMQ + Redis for queue/scheduling from day one (this part of the original design is stack-agnostic and worth keeping as-is).
- Single-region worker to start; multi-region quorum logic is built early but only *wired up* to multiple regions later.
- Docker Compose for local + early production; Kubernetes deferred to the scale-out phase.

---

## Phase 0 — Project Setup (few days)

**Goal:** a monorepo that runs locally with one command.

- Set up a Turborepo or Nx monorepo: `apps/web`, `apps/api`, `apps/worker`, `apps/scheduler`, `packages/database` (Prisma), `packages/shared-types`.
- `docker-compose.yml` with Postgres + Redis for local dev.
- NestJS app scaffolded (`apps/api`) with `@nestjs/config`, a health-check endpoint, and Prisma wired in.
- Vite + React + TS app scaffolded (`apps/web`) with React Router, TanStack Query, and a basic layout shell.
- ESLint/Prettier shared config, GitHub Actions CI that runs lint + typecheck + tests on push.
- Shared `packages/shared-types` with Zod schemas so FE/BE agree on DTOs from day one (this alone will save you a lot of pain later).

**Milestone:** `docker compose up` + `pnpm dev` gives you a running API and a React app that can hit `/health`.

---

## Phase 1 — Auth & Multi-Tenancy (1–2 weeks)

**Goal:** users can sign up, get an org, invite teammates, and every query is tenant-scoped.

- Prisma schema: `Organization`, `User`, `Membership`, `Role` (Owner/Admin/Editor/Viewer).
- Auth: email+password with argon2 hashing + JWT (access + refresh tokens). Skip WorkOS/SSO for now — that's an upgrade path, not a v1 need.
- Signup flow auto-creates an org (matches Flow A in the design doc).
- **Tenant context middleware**: extract `org_id` from JWT, attach to request context.
- Start simple on isolation: a Prisma extension/middleware that injects `WHERE org_id = :ctx` on every query. Add real Postgres **Row-Level Security** as a hardening pass once the basic app works — don't block your MVP on RLS, but don't skip it before real user data goes in.
- Frontend: login/signup pages, auth context, protected routes, an org-switcher if you support multiple orgs per user.

**Milestone:** two different signed-up orgs cannot see each other's data, verified with an actual test that tries to cross the boundary.

---

## Phase 2 — Monitors + Single-Region Checking (2–3 weeks)

**Goal:** a user can create an HTTP monitor and see it go up/down. This is the core loop — get this rock solid before anything else.

- Prisma `Monitor` model (type, target, interval, config JSON, status).
- NestJS `MonitorsModule`: CRUD endpoints + validation (Zod/class-validator).
- `apps/scheduler`: on monitor create/update, register a repeatable BullMQ job (`checks:http` queue) at the configured interval, with **jittered offsets** so thousands of monitors don't all fire on the same second (the design doc calls this out as a real bottleneck — worth respecting even at small scale since it's cheap to build in now).
- `apps/worker`: a Check Executor that runs HTTP checks (axios/undici), normalizes the result (status, latency, assertions pass/fail), and writes to a `CheckResult` table in Postgres (plain table, indexed on `monitor_id, checked_at` — this is your Timescale stand-in for now).
- Worker publishes the result on a Redis Pub/Sub channel (`monitor:{id}:result`) — this is the seam that Phase 3 (incidents) and Phase 6 (realtime) both plug into.
- Frontend: monitor list, create/edit form, a detail page showing recent check history (simple line chart of latency + status is enough at this stage).

**Milestone:** create a monitor against a real URL, watch it check on schedule, kill the target and watch status flip to "down" in the dashboard within one refresh.

---

## Phase 3 — Incident Detection Engine (1–2 weeks)

**Goal:** implement the quorum-based incident logic — this is PingWatch's actual differentiator, so it's worth doing properly even before multi-region is real.

- `IncidentEngine` service subscribes to the Redis Pub/Sub result channel.
- Sliding-window buffer per monitor; apply the rule from the design doc: **N consecutive failures** before opening an incident. (Quorum-across-regions logic can be written now with a "regions" concept even if you're only running one region — set quorum threshold to 1 region for now, and the code doesn't need to change when you add regions later.)
- On breach: insert `Incident` row, publish `incident:opened` event.
- On recovery: auto-resolve, compute MTTR.
- Frontend: incidents list + detail timeline (open → events → resolved).

**Milestone:** simulate repeated failures against a test endpoint and confirm an incident opens after the threshold, not on the first blip — and auto-resolves on recovery.

---

## Phase 4 — Alerting (1–2 weeks)

**Goal:** people actually get notified.

- `AlertChannel` model (Slack webhook, email, generic webhook — skip SMS/Twilio until you need it, it's the most operationally annoying one).
- `EscalationPolicy` + `EscalationStep` models, simple linear escalation (step 1 immediate, step 2 after N minutes if unacknowledged).
- Escalation timers as **delayed BullMQ jobs**, cancelled on ack — matches the design doc's approach and avoids a polling cron.
- `apps/notifier`: channel adapters (start with email via Resend/SES and a generic webhook; Slack next).
- Frontend: escalation policy builder, alert channel setup, ack button on incident view.

**Milestone:** an incident firing sends a real Slack/email notification, and acknowledging it stops the escalation chain.

---

## Phase 5 — Public Status Pages (1–2 weeks)

**Goal:** the customer-facing trust layer.

- `StatusPage` model + `StatusPage <-> Monitor` join.
- Public read-only endpoints (no auth), served from a **read replica or at minimum a separate, cache-friendly query path** — don't let public traffic share load with authenticated API traffic even at small scale.
- Since you're on a React SPA rather than Next.js, status pages won't get free ISR/edge caching — put a CDN (Cloudflare) in front of the public API responses with a short TTL (30–60s) and bust the cache on incident state change via a webhook, same idea as the design doc, just implemented as HTTP cache headers instead of Next revalidation.
- Frontend: a separate lightweight status-page route (or a genuinely separate small app if you want it to load fast independent of the dashboard bundle) showing current status + 30/60/90-day uptime.
- Custom domain support can wait — ship on `pingwatch.app/status/{slug}` first.

**Milestone:** a public visitor with no login sees live status and it updates within the cache TTL when an incident opens.

---

## Phase 6 — Realtime Dashboard (3–5 days)

**Goal:** the dashboard updates live instead of on refresh.

- `apps/ws-gateway` (or a WS gateway inside the API for now — split out later if it becomes a scaling bottleneck): subscribes to the same Redis Pub/Sub channels, pushes to connected clients via Socket.io, scoped by `org_id` room.
- Frontend: TanStack Query cache updated via WS events instead of polling.

**Milestone:** open the dashboard in two tabs, trigger a check failure, watch both update without a refresh.

---

## Phase 7 — Hardening & Ops (ongoing, ~1–2 weeks focused)

- Rate limiting: Redis sliding-window counters per tenant/API key (skip the gateway-layer piece until you actually put Kong/NGINX in front — a Nest guard is enough at this scale).
- API keys for programmatic access (`ApiKey` model, scoped).
- Audit log on mutating actions.
- Basic observability: structured logging, a `/metrics` endpoint (Prometheus format), error tracking (Sentry).
- Test coverage on the incident-detection logic specifically — it's the part where a subtle bug (e.g., quorum math) silently costs trust.
- Dead-letter queue handling for failed jobs (BullMQ supports this natively — wire up the `dlq:*` pattern from the design doc).

**Milestone:** you'd be comfortable putting a real (small) customer's monitors on this without watching it constantly.

---

## Phase 8 — Scale-Out (only when you actually need it)

Don't start here — these are the upgrades the original design doc anticipates, triggered by real signals, not by schedule:

- **Multi-region workers**: deploy `apps/worker` to 2–3 regions (Fly.io/Render regional runners are a much lighter lift than K8s for this), wire the quorum threshold up to real regions.
- **TimescaleDB**: migrate `CheckResult` once the plain Postgres table's write volume or rollup-query latency actually becomes a problem — not preemptively.
- **Kafka**: only if Redis Pub/Sub fan-out genuinely caps out (the design doc's own rule of thumb is "well before 100k concurrent monitors" — you'll see it coming).
- **Kubernetes**: move off Docker Compose/simple VM deploys once you need real autoscaling or have more than a couple of services to coordinate.
- **RLS hardening, schema-per-tenant for enterprise, WorkOS SSO, Stripe metered billing**: pull each in when a specific customer/contract requires it.

---

## Suggested order of operations, condensed

1. Monorepo + auth + tenancy
2. Monitors + scheduler + worker (single region, HTTP only)
3. Incident engine (quorum logic, threshold=1 region initially)
4. Alerting (email + webhook first)
5. Status pages
6. Realtime WS updates
7. Hardening (rate limits, audit log, observability)
8. Add TCP/DNS/SSL monitor types (straightforward once HTTP works)
9. Scale-out phases as triggered by real load

A reasonable target: **phases 0–6 as an MVP you could put a real customer on, in roughly 8–12 weeks** for one focused developer, longer with monitor types (TCP/DNS/SSL) and billing folded in alongside.

Want me to scaffold the actual monorepo (Phase 0) as a starting codebase, or start with the Prisma schema for Phase 1?
