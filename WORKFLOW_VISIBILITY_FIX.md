# Workflow visibility fix

The GitHub Actions workflow belongs at:

```text
.github/workflows/build-windows-setup.yml
```

macOS Finder hides `.github` because it is a dot-folder. The original zip already includes it, but if you uploaded the project by dragging only the visible folders into GitHub, the `.github` folder was probably skipped.

## Fast fix from Terminal

From the project root:

```bash
mkdir -p .github/workflows
cp GITHUB_ACTIONS_WORKFLOW/build-windows-setup.yml .github/workflows/build-windows-setup.yml
git add .github/workflows/build-windows-setup.yml
git commit -m "Add Windows setup build workflow"
git push
```

## Finder-only workaround

Press `Command + Shift + .` in Finder to toggle hidden files/folders. Then you should see `.github` and `.gitignore`.

## After pushing

Go to GitHub → Actions. The workflow should appear as:

```text
Build Windows Setup EXE
```

Run it manually with `Run workflow`, or push a tag like `v0.1.0`.
