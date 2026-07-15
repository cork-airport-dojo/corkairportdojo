# CorkAirportDojo

CorkAirportDojo is a private TypeScript application for students learning content, editorial workflows, and dashboard-style management tools.

The current platform combines public-facing learning pages with authenticated content management for articles, modules, and resources.

## What is in this application

The project currently includes:

- Public pages such as home, modules, articles, resources, and about
- GitHub sign-in handled through Supabase
- Editorial tools for creating and updating content
- Shared dashboard layouts and feature-specific rails
- Reusable UI primitives built with shadcn-style patterns, SCSS modules, and shared components

## Repository structure

The main application currently lives in `website/`.

Key areas:

- `website/app/components/` shared and feature components
- `website/app/routes/` route modules and API endpoints
- `website/app/store/` Zustand stores
- `website/app/lib/` Supabase helpers, schemas, loaders, constants, and API helpers
- `website/design-system.md` design and UI guidance
- `website/package.json` development and build scripts

## Core stack

The current stack includes:

- React 19
- React Router 7
- TypeScript
- Supabase
- Zustand
- SCSS modules
- shadcn-based UI primitives
- Recharts where dashboard visualisation is needed

## Running locally

From the `website/` directory:

```bash
npm install
npm run dev
```

Other useful scripts:

```bash
npm run build
npm run start
npm run typecheck
```

## Environment

The app expects Supabase environment variables for browser, server, and admin access.

Please create a `.env` file at root level of the project and add the required values.

Required values include:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Authentication

Authentication is handled through Supabase with GitHub sign-in.

The login flow redirects users to GitHub and then returns them to the requested route or `/profile` by default.

All users logn will be assigned a `viewer` role.
If the user needs to be assigned a role `Admin` or `Editor` they will be assigned through supebase.

## SSR and application boot

React Router SSR is enabled for the app.

The root app bootstraps shared providers and listens for Supabase auth state changes so the auth store stays synchronized.

## Where to read next

If you are new to the project, start with:

- `website/ONBOARDING.md`
- `website/design-system.md`

## Notes

- This repository is private
- The default branch is `main`
- The application is SSR-enabled
- Server-side privileged writes use the Supabase admin client
