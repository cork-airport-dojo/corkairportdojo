# Onboarding

This document helps new developers get productive in CorkAirportDojo as quickly as possible.

## What this project is

CorkAirportDojo is a private learning platform and content management application built for student-focused education. It combines public content pages with authenticated editorial workflows and dashboard tooling.

The active application code lives in `website/`.

## Before you start

Make sure you have:

- Node.js >=22 
- npm available locally
- access to the private GitHub repository
- access to the Supabase project
- the required environment variables for local development

## First-time setup

From the `website/` directory:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run start
npm run typecheck
```

## Required environment variables

The application expects these values:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are validated in the server and browser Supabase helpers.

## Architecture overview

### Frontend

The app uses:

- React 19
- React Router 7 with SSR enabled
- SCSS modules
- shadcn-style UI primitives
- Zustand for app state
- TanStack Query where request lifecycle management is useful

### Data and authentication

Supabase is used for:

- browser auth state
- cookie-based request auth on the server
- server-side admin writes through a privileged client

There are separate helpers for:

- browser access
- request-scoped server auth access
- admin server access

## Main directories

### `website/app/components/`

Shared and feature UI components.

### `website/app/routes/`

Public pages, authenticated pages, and API routes.

### `website/app/store/`

Zustand stores for auth, editor state, resources, and related features.

### `website/app/lib/`

Supabase helpers, schemas, loaders, constants, and API helpers.

### `website/design-system.md`

Visual rules, component expectations, colour usage, and layout guidance.

## Recommended development workflow

### 1. Understand the feature before changing it

Before editing a screen, inspect:

- the route file
- the main feature component
- related stores
- related API routes
- server helpers and validation schemas

### 2. Prefer existing primitives

Before creating new styles, check whether the app already has:

- a shared card pattern
- button primitives
- dialog primitives
- shared shell layout
- reusable list, rail, or panel patterns

### 3. Keep styles local and intentional

Feature styles should live in SCSS modules near the component.

Do not introduce one-off colour, spacing, or radius decisions without checking `website/design-system.md`.

### 4. Keep privileged logic server-side

For create, update, and delete flows:

- validate request payloads on the server
- enforce role checks server-side
- perform privileged writes through server routes

Even if the UI hides controls, permission checks must still exist on the server.

## Content model expectations

The current product includes content workflows for:

- articles
- modules
- resources

When adding new content relationships or fields, update:

- the DB schema
- the server route
- the client API helper
- the store if relevant
- the UI
- the documentation if a new pattern is introduced
- Enable RLS on all new created tables.

## UI expectations

The product style is intentionally sharp, dark, structured, and minimal.

Important defaults:

- square corners for most surfaces
- thin borders instead of shadow-heavy cards
- strong separation between panels
- consistent typography and spacing
- restrained animation
- reuse of shared primitives over custom one-off widgets

## Design-system update rule

If you add a meaningful new pattern, update `website/design-system.md` in the same workstream.

Examples:

- a new right-rail pattern
- a new confirmation-dialog convention
- resource-to-article linking UI
- chart or visualisation rules
- a new validation pattern

## Good first tasks for new developers

Recommended starter tasks:

- run the app locally
- inspect the app shell and route structure
- trace one public route from route file to rendered component
- trace one authenticated mutation from UI to API route to Supabase write
- review the design system and compare it to a live screen

## Suggested reading order

1. `README.md`
2. `website/design-system.md`
3. `website/app/root.tsx`
4.  the route and component files for the feature you are working on

## Final notes

Keep changes small, consistent, and documented.

If you introduce a new shared pattern, update both the implementation and the documentation so the next developer understands how it should be used.