# @repo/ui

The shared React component library used across all Numos apps, based on [shadcn/ui](https://ui.shadcn.com/docs).

It exports reusable components, blocks, hooks, icons, and the shared [Tailwind CSS](https://tailwindcss.com/) and PostCSS configuration so every app has a consistent look and feel.

## Exports

- `./components/*` — UI components
- `./blocks/*` — larger composed sections, including brand assets
- `./bits/*` — small building blocks
- `./hooks/*` — shared React hooks
- `./icons/*` — icon set
- `./lib/*`, `./lib/utils` — helpers
- `./styles.css`, `./postcss.config` — shared styling config

## Usage

```ts
import { Button } from '@repo/ui/components/button'
```
