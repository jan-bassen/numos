# Numos

This is the main monorepo for Numos.

## Building the stack

Start the entire stack with:
```sh
turbo build
```

Test just the studio with:
```sh
turbo dev --filter=studio
```

Install npm package in homepage with:
```sh
pnpm i package --filter=web
```

## What's inside?

This includes the following packages/apps:

### Apps and Packages
- `web`: a Next.js site including the homepage and docs
- `studio`: a Next.js app for creating and managing dynamic and interactive digital assets
- `core`: an AWS cdk app for deploying the backend
- `@repo/tsconfig`: a shared tsconfig used throughout the monorepo
- `@repo/ui`: a React component library based on shadcn/ui including icons and tailwind config
- `@repo/engine`: the core engine for simulating and running node graphs
- `@repo/email`: a react email project (not in use yet)
- `@repo/shared`: a utility package for any other shared assets

## Tools
The repo is build with the following tools and services:

### Services
- [Vercel](https://vercel.com) for hosting
- [Supabase](https://supabase.com/docs) as the PaaS of our choice
- [AWS](https://aws.amazon.com/de/free/?sc_channel=ps) for email and hosting the core backend
- [Linear](https://linear.app/) for development management
- [Stripe](https://dashboard.stripe.com/login?redirect=/test/dashboard) for payments
- [Posthog](https://eu.posthog.com/) for analytics and monitoring
- [Sentry](sentry.io) for debugging
- [Alchemy](alchemy.com) for RPC and blockchain webhooks

### Main
- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) for frontend development
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for code linting and formatting
- [shadcn/ui](https://ui.shadcn.com/docs) for reusable components
- [Payload](https://payloadcms.com/docs/getting-started/what-is-payload) for the homepage CMS

### Secondary
- [lodash](https://lodash.com/) for common utilities
- [zod](https://zod.dev/) for validation
- [drizzle](https://orm.drizzle.team/docs/overview) for db usage outside of the supabase SDK
- [viem](https://viem.sh/docs/getting-started) for anything blockchain
- [ai sdk](https://sdk.vercel.ai/getting-started) for anything ai
- [sharp](https://sharp.pixelplumbing.com/) for image manipulation
- [luxon](https://moment.github.io/luxon/#/) for datetime
- [decimal.js](https://mikemcl.github.io/decimal.js/) for maths
- [dnd-kit](https://dndkit.com/) for draggable ui

