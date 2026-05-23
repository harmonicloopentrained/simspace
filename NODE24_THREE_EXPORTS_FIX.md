# Node 24 / Three.js package exports fix

GitHub Actions reached `scripts/prepare-vault.js`, then failed here:

```text
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './package.json' is not defined by "exports" in node_modules/three/package.json
```

## Cause

The previous vendor-copy script used:

```js
require.resolve('three/package.json')
```

Under modern Node/package `exports` rules, a package can prevent direct resolution of private subpaths such as `package.json`. Three.js does that here, so Node 24 rejects the lookup.

## Fix

`prepare-vault.js` now resolves the public package entry instead:

```js
require.resolve('three')
```

Then it walks upward until it finds the installed package root containing `package.json`. This keeps the script compatible with Node 24 and Three.js package exports.

## Files changed

- `scripts/prepare-vault.js`
