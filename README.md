# Numos

This is the main mono repo for Numos.

## Using this example

Start the entire stack with:

```sh
turbo build
```
Test the studio with:

```sh
turbo dev --filter=studio
```

## What's inside?

This includes the following packages/apps:

### Apps and Packages

- `web`: A [Next.js](https://nextjs.org/) site including the homepage and docs
- `studio`: A [Next.js](https://nextjs.org/) app for creating and managing dynamic and interactive digital assets
- `core`: A [AWS](https://eu-central-1.console.aws.amazon.com/) cdk app for deploying the backend
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/ui`: A React component library based on shadcn/ui
- `@repo/icons`: An icon library based on PikaIcons and Lucide

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

The repo is build with the following tools:

- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) for frontend development
- [Tailwind](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for code linting and formatting