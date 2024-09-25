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

## What's inside?

This includes the following packages/apps:

### Apps and Packages

- `web`: a Next.js site including the homepage and docs
- `studio`: a Next.js app for creating and managing dynamic and interactive digital assets
- `core`: an AWS cdk app for deploying the backend
- `@repo/tsconfig`: a shared tsconfig used throughout the monorepo
- `@repo/ui`: a React component library based on shadcn/ui including icons and tailwind config
- `@repo/engine`: the core engine for simulating and running node graphs

### Main Utilities

The repo is build with the following tools:

- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) for frontend development
- [Tailwind](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for code linting and formatting