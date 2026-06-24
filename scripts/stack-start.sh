#!/usr/bin/env bash
# ============================================================
# stack-start.sh — Start the full application stack
# Usage: ./stack-start.sh          (start, skip image rebuild)
#        ./stack-start.sh --build  (force rebuild images first)
# ============================================================
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"
APP_USER="appuser"

# Re-exec as appuser if we are root
if [ "$(id -un)" = "root" ]; then
  exec su - "$APP_USER" -s /bin/bash -c "bash '${SCRIPTS_DIR}/stack-start.sh' $*"
fi

export XDG_RUNTIME_DIR="/run/user/$(id -u)"
unset DBUS_SESSION_BUS_ADDRESS 2>/dev/null || true

# Read ports from .env
ENV_FILE="$ROOT_DIR/.env"
API_PORT="4001"
WEB_PORT="8080"
if [ -f "$ENV_FILE" ]; then
  _ap=$(grep -E '^API_PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2 | tr -d '[:space:]'); [ -n "$_ap" ] && API_PORT="$_ap"
  _wp=$(grep -E '^WEB_PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2 | tr -d '[:space:]'); [ -n "$_wp" ] && WEB_PORT="$_wp"
fi

# Remove containers that are holding our ports
cleanup_port_conflicts() {
  local all ids
  all="$(podman ps -a --format '{{.ID}} {{.Ports}}' 2>/dev/null || true)"
  for p in "$API_PORT" "$WEB_PORT"; do
    ids="$(printf '%s\n' "$all" | awk -v port=":${p}->" '$0 ~ port {print $1}')"
    if [ -n "${ids:-}" ]; then
      echo "[stack-start] Releasing port $p — removing: $ids"
      podman rm -f $ids 2>/dev/null || true
    fi
  done
}

echo "[stack-start] ── Starting PostgreSQL ──"
bash "$SCRIPTS_DIR/db-start.sh"

# Optionally rebuild images
if [[ "${1:-}" == "--build" ]]; then
  echo "[stack-start] ── Building container images (--build flag) ──"
  cd "$ROOT_DIR"
  podman-compose --profile cloudflare build
fi

echo "[stack-start] ── Releasing port conflicts ──"
cleanup_port_conflicts

echo "[stack-start] ── Starting containers ──"
cd "$ROOT_DIR"
podman-compose --profile cloudflare up -d --force-recreate

echo ""
echo "[stack-start] ── Status ──"
bash "$SCRIPTS_DIR/stack-status.sh"
echo "[stack-start] Done ✓"
