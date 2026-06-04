# studio

The Numos Studio — a creator app for designing and managing dynamic and interactive digital assets through a visual, node-based editor.

Built with [Next.js](https://nextjs.org/) and TypeScript, styled with [Tailwind CSS](https://tailwindcss.com/), and backed by [Supabase](https://supabase.com/). The visual editor is powered by [Rete.js](https://retejs.org/).

## Development

From the repo root:

```sh
turbo dev --filter=studio
```

Or from this directory:

```sh
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Core dependencies

- [Rete.js](https://retejs.org/) for the node-based editor
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [zod](https://zod.dev/) for validation
- [Supabase SDK](https://supabase.com/docs) for auth and data
