# GitHub Actions lockfile / Node 20 warning fix

This package has been patched so the Windows installer workflow no longer requires a `package-lock.json` before the first build.

## What changed

- `actions/checkout@v4` -> `actions/checkout@v6`
- `actions/setup-node@v4` -> `actions/setup-node@v6`
- `actions/upload-artifact@v4` -> `actions/upload-artifact@v6`
- Node runtime set to `24`
- npm package-manager caching disabled with `package-manager-cache: false`
- Dependency install step now uses:
  - `npm ci` when `package-lock.json` exists
  - `npm install --no-audit --no-fund` when no lockfile exists

## Why this fixes it

The previous workflow asked `setup-node` to use npm caching. npm caching requires a lockfile such as `package-lock.json`. Since this project zip did not include one, GitHub Actions stopped before dependencies were installed.

This workflow does not enable npm caching, so the missing lockfile is no longer fatal.

## Recommended next step

Replace your repository workflow with:

```text
.github/workflows/build-windows-setup.yml
```

from this zip, commit it, push it, and run the workflow again.
