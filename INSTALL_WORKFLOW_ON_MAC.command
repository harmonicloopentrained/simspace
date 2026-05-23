#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .github/workflows
cp GITHUB_ACTIONS_WORKFLOW/build-windows-setup.yml .github/workflows/build-windows-setup.yml
echo "Installed workflow to .github/workflows/build-windows-setup.yml"
echo "Now commit and push the .github folder:"
echo "  git add .github/workflows/build-windows-setup.yml"
echo "  git commit -m 'Add Windows setup build workflow'"
echo "  git push"
