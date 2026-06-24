# KeyHub

KeyHub is a digital goods storefront built with Next.js App Router, TypeScript,
Tailwind CSS, shadcn/ui, Supabase-ready auth/data boundaries, Stripe Checkout
route handlers, Bun, and Biome.

## Getting Started

Install dependencies and run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

- `bun dev` starts local development.
- `bun run build` creates a production build.
- `bun check` runs Biome checks.
- `bun format` formats the codebase.
- `bun typecheck` runs TypeScript.
- `bun run db:start` starts the local Supabase stack.
- `bun run db:reset` applies migrations and seed data locally.
- `bun run db:types` regenerates Supabase database types.

## Structure

The project follows a Feature-Sliced Design inspired layout:

- `src/app` for App Router routes and route handlers.
- `src/views` for page-level compositions.
- `src/widgets` for reusable page sections.
- `src/features` for user actions and client stores.
- `src/entities` for business models, schemas, and demo data.
- `src/shared` for UI primitives, providers, config, integrations, and helpers.

Copy `.env.example` to `.env.local` when wiring Supabase and Stripe.

## Supabase

The database foundation lives in `supabase/migrations` and `supabase/seed.sql`.
It creates the catalog, orders, entitlements, profile roles, RLS policies, and
public/private storage buckets required by the plan.

For local development:

```bash
bun run db:start
bun run db:reset
bun run db:types
```

Then copy the local Supabase anon and service-role keys into `.env.local`.
