# @repo/tsconfig

Shared [TypeScript](https://www.typescriptlang.org/) configurations used throughout the monorepo, so every app and package extends a common base.

## Usage

In a package's `tsconfig.json`:

```json
{
  "extends": "@repo/tsconfig/base.json"
}
```

Available configs:

- `base.json` — base config for all packages
- `react-library.json` — for React component libraries
