# web

The public-facing website for Numos — homepage, marketing pages, and docs.

Built with [Next.js](https://nextjs.org/) and uses [Payload](https://payloadcms.com/) (Postgres-backed) as a CMS for editable content, served from the `(payload)` admin route.

## Development

From the repo root:

```sh
turbo dev --filter=web
```

Or from this directory:

```sh
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Payload

```sh
pnpm typegen     # regenerate Payload types after editing collections
pnpm importgen   # regenerate the Payload import map
```
