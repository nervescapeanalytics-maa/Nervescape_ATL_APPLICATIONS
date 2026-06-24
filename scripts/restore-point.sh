#!/usr/bin/env bash
# Create a timestamped restore point under .backups/ (pre-Cloudflare / pre-change snapshot).
set -euo pipefail

APP_HOME="/home/appuser/APP_HOME"
cd "$APP_HOME"

STAMP="$(date +%Y%m%d_%H%M%S)"
LABEL="${1:-restore}"
DEST=".backups/${LABEL}_${STAMP}"

mkdir -p "$DEST"

copy_if_exists() {
  local src="$1"
  local rel="${2:-$(basename "$src")}"
  if [[ -e "$src" ]]; then
    mkdir -p "$DEST/$(dirname "$rel")"
    cp -r --preserve=timestamps "$src" "$DEST/$rel" 2>/dev/null || cp -r "$src" "$DEST/$rel"
  fi
}

# Application stack & runtime
copy_if_exists docker-compose.yml
copy_if_exists docker-compose.cloudflare-config.yml
copy_if_exists .env.example
copy_if_exists README.md
copy_if_exists scripts/compose.sh
copy_if_exists scripts/restore-point.sh
copy_if_exists scripts/restore-from-point.sh

# Cloudflare (if present)
copy_if_exists cloudflare/config.yml cloudflare/config.yml
copy_if_exists cloudflare/config.yml.example cloudflare/config.yml.example

# Container build / proxy
copy_if_exists backend/Dockerfile backend/Dockerfile
copy_if_exists frontend/Dockerfile frontend/Dockerfile
copy_if_exists frontend/nginx.conf frontend/nginx.conf

# Git pointer (no secrets)
{
  echo "label=$LABEL"
  echo "created=$(date -Iseconds)"
  echo "commit=$(git rev-parse HEAD 2>/dev/null || echo unknown)"
  echo "branch=$(git branch --show-current 2>/dev/null || echo unknown)"
  echo "message=$(git log -1 --pretty=%s 2>/dev/null || echo unknown)"
} >"$DEST/MANIFEST.txt"

echo "Restore point created: $DEST"
echo "  commit: $(grep '^commit=' "$DEST/MANIFEST.txt" | cut -d= -f2-)"
echo "Restore with: bash scripts/restore-from-point.sh $DEST"
