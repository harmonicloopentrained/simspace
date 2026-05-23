# Chrysalis Simulation Vault

A repository-ready Electron vault for packaging the selected HTML simulations into a Windows NSIS installer named `ChrysalisVault-Setup-<version>.exe`.

## What this package does

- Keeps the original uploaded simulation HTML files in `source-html/included/`.
- Excludes non-simulation theory/document pages from the app package.
- Generates patched offline runtime copies in `vault/sims/`.
- Vendors Three.js locally from npm during `npm run vault:prepare`.
- Replaces legacy CDN edges with local paths so the built application runs offline.
- Provides a structured main menu where each simulation can be launched and exited back to the vault.
- Builds a normal Windows setup installer through GitHub Actions.

## Included simulations

1. `complexuniverse(2).html`
2. `9Dvector.html`
3. `thebeginningofbeginnings.html`
4. `polyphoniccosmos.html`
5. `Zomegareality.html`
6. `super_highway.html`
7. `strings_and_dimensions.html`
8. `hyperdimensionalmultiverse.html`
9. `multiverse.html`
10. `ORDERINTHECHAOS.html`
11. `JUSTAMULTIDREAM.html`
12. `JUSTAMEMORY.html`
13. `failedexperimentaluniverse.html`
14. `BIG_BANG.html`

## Excluded as non-simulation documents

- `creationseed.html`
- `OURUNIVERSE.html`
- `ORIGINOFMASS.html`
- `HARMONICS(1).html`
- `FORCESANDLAWS(1).html`
- `EMERGENT_SPACETIME(1).html`

These excluded files are preserved under `source-html/excluded/` for reference, but they are not included in the packaged Electron application.

## GitHub Actions build

The workflow is located at:

```text
.github/workflows/build-windows-setup.yml
```

To produce the installer:

1. Push this repository to GitHub.
2. Open the repository's **Actions** tab.
3. Run **Build ChrysalisVault Setup EXE** manually, or push a version tag such as `v0.1.0`.
4. Download the `ChrysalisVault-Setup` artifact.
5. The generated installer will be named like:

```text
ChrysalisVault-Setup-0.1.0.exe
```

## Local development

Requires Node.js.

```bash
npm install
npm start
```

Build the Windows installer locally from Windows:

```bash
npm install
npm run dist:win
```

The installer will appear in `dist/`.

## Offline behavior

The finished installed application is intended to run offline. It carries its Electron/Chromium runtime and local simulation assets.

The build process itself still needs dependencies unless you create a separate offline build kit. GitHub Actions handles that dependency installation automatically.

## Security notes

This wraps and packages the HTML/JavaScript simulations, but JavaScript assets inside an Electron app should not be considered cryptographically secret. The package uses Electron's ASAR archive by default, which reduces casual browsing but does not prevent a determined user from extracting source assets. Treat this as controlled distribution and presentation, not source-code DRM.

## GitHub Actions lockfile note

This package's workflow works with or without `package-lock.json`. If a lockfile is present, it uses `npm ci`; otherwise it falls back to `npm install --no-audit --no-fund`. npm caching is disabled so GitHub Actions does not fail on a missing lockfile during first setup.
