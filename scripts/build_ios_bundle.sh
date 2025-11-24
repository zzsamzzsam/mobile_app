#!/usr/bin/env bash
# Generate an iOS main.jsbundle and copy assets to ios/tpasc
# Usage:
#   ./scripts/build_ios_bundle.sh [entry-file]
# Example:
#   ./scripts/build_ios_bundle.sh          # defaults to index.js
#   ./scripts/build_ios_bundle.sh index.tsx
set -euo pipefail

# Find project root (directory containing package.json)
CUR_DIR="$(pwd)"
PROJECT_ROOT="$CUR_DIR"
while [ ! -f "$PROJECT_ROOT/package.json" ]; do
  if [ "$PROJECT_ROOT" = "/" ] || [ -z "$PROJECT_ROOT" ]; then
    echo "Error: package.json not found. Run this from inside your project or place the script in the repo."
    exit 1
  fi
  PROJECT_ROOT="$(dirname "$PROJECT_ROOT")"
done

cd "$PROJECT_ROOT"

ENTRY_FILE="${1:-index.js}"
PLATFORM="ios"
OUT_DIR="ios/tpasc"
BUNDLE_OUTPUT="$OUT_DIR/main.jsbundle"
ASSETS_DEST="$OUT_DIR"

echo "Project root: $PROJECT_ROOT"
echo "Entry file:   $ENTRY_FILE"
echo "Bundle out:   $BUNDLE_OUTPUT"
echo "Assets dest:  $ASSETS_DEST"
echo

# Ensure node and npx are available
if ! command -v node >/dev/null 2>&1; then
  echo "Error: node not found in PATH. Install Node or load your node environment (nvm) and retry."
  exit 1
fi
if ! command -v npx >/dev/null 2>&1; then
  echo "Error: npx not found in PATH. Ensure npm/node is installed."
  exit 1
fi

# If node_modules is missing, run npm ci to restore exact deps (safe for CI/local)
if [ ! -d "node_modules" ]; then
  echo "node_modules not found — running 'npm ci' to install dependencies (this may take a while)..."
  npm ci
fi

# Create output directory
mkdir -p "$OUT_DIR"

# Run react-native bundle
echo "Running: npx react-native bundle --entry-file $ENTRY_FILE --platform $PLATFORM --dev false --bundle-output $BUNDLE_OUTPUT --assets-dest $ASSETS_DEST"
npx react-native bundle \
  --entry-file "$ENTRY_FILE" \
  --platform "$PLATFORM" \
  --dev false \
  --bundle-output "$BUNDLE_OUTPUT" \
  --assets-dest "$ASSETS_DEST"

echo
echo "Bundle command finished. Verifying output files:"
if [ -f "$BUNDLE_OUTPUT" ]; then
  ls -lh "$BUNDLE_OUTPUT"
else
  echo "Error: bundle file not found at $BUNDLE_OUTPUT"
  exit 1
fi

echo
echo "Assets copied to: $ASSETS_DEST"
ls -la "$ASSETS_DEST" | sed -n '1,200p'

echo
echo "Done. You can now open Xcode and build the workspace (open ios/*.xcworkspace)."