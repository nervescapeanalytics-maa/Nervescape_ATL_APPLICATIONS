#!/usr/bin/env bash
# Restore files from a restore point directory under .backups/.
set -euo pipefail

APP_HOME="/home/appuser/APP_HOME"
cd "$APP_HOME"

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  echo "Usage: $0 <restore-point-dir>" >&2
  echo "Example: $0 .backups/cloudflare_pre_20260604_120000" >&2
  echo "" >&2
  echo "Available restore points:" >&2
  ls -1dt .backups/*/ 2>/dev/null | head -10 || true
  exit 1
fi

if [[ ! -d "$SRC" ]]; then
  echo "Not found: $SRC" >&2
  exit 1
fi

restore_file() {
  local rel="$1"
  if [[ -f "$SRC/$rel" ]]; then
    mkdir -p "$(dirname "$rel")"
    cp "$SRC/$rel" "$rel"
    echo "  restored $rel"
  fi
}

echo "Restoring from: $SRC"
if [[ -f "$SRC/MANIFEST.txt" ]]; then
  cat "$SRC/MANIFEST.txt"
fi

restore_file docker-compose.yml
restore_file docker-compose.cloudflare-config.yml
restore_file .env.example
restore_file README.md
restore_file scripts/compose.sh
restore_file scripts/restore-point.sh
restore_file scripts/restore-from-point.sh
restore_file cloudflare/config.yml
restore_file cloudflare/config.yml.example
restore_file backend/Dockerfile
restore_file frontend/Dockerfile
restore_file frontend/nginx.conf

echo "Done. Rebuild/restart stack if needed: bash scripts/compose.sh up -d --build"
