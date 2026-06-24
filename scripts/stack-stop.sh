#!/usr/bin/env bash
# ============================================================
# stack-stop.sh — Stop all containers and PostgreSQL
# ============================================================
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"
APP_USER="appuser"

if [ "$(id -un)" = "root" ]; then
  exec su - "$APP_USER" -s /bin/bash -c "bash '${SCRIPTS_DIR}/stack-stop.sh'"
fi

export XDG_RUNTIME_DIR="/run/user/$(id -u)"
unset DBUS_SESSION_BUS_ADDRESS 2>/dev/null || true

echo "[stack-stop] ── Stopping containers ──"
cd "$ROOT_DIR"
podman-compose --profile cloudflare down --remove-orphans 2>/dev/null || true

echo "[stack-stop] ── Force-removing known containers (if any remain) ──"
podman rm -f lms-cloudflared lms-robofrontend lms-backend 2>/dev/null || true

echo "[stack-stop] ── Stopping PostgreSQL ──"
bash "$SCRIPTS_DIR/db-stop.sh" || true

echo "[stack-stop] Done ✓"
