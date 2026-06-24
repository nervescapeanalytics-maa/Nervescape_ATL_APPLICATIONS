#!/usr/bin/env bash
# ============================================================
# stack-status.sh — Show status of the full stack
# ============================================================
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPTS_DIR")"
APP_USER="appuser"

if [ "$(id -un)" = "root" ]; then
  exec su - "$APP_USER" -s /bin/bash -c "bash '${SCRIPTS_DIR}/stack-status.sh'"
fi

export XDG_RUNTIME_DIR="/run/user/$(id -u)"
unset DBUS_SESSION_BUS_ADDRESS 2>/dev/null || true

echo "╔══════════════════════════════════════════════╗"
echo "║           RoboTinkerPreneur Stack Status      ║"
echo "╚══════════════════════════════════════════════╝"

echo ""
echo "── PostgreSQL ──"
bash "$SCRIPTS_DIR/db-status.sh"

echo ""
echo "── Containers ──"
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true

echo ""
echo "── Health Check ──"
cd "$ROOT_DIR"
API_PORT="4001"
WEB_PORT="8080"
[ -f ".env" ] && {
  _ap=$(grep -E '^API_PORT=' .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]'); [ -n "$_ap" ] && API_PORT="$_ap"
  _wp=$(grep -E '^WEB_PORT=' .env 2>/dev/null | cut -d= -f2 | tr -d '[:space:]'); [ -n "$_wp" ] && WEB_PORT="$_wp"
}
if curl -sf "http://localhost:${API_PORT}/api/health" >/dev/null 2>&1; then
  echo "  ✓ Backend  (port $API_PORT) — UP"
else
  echo "  ✗ Backend  (port $API_PORT) — DOWN or not ready"
fi
if curl -sf "http://localhost:${WEB_PORT}/" >/dev/null 2>&1; then
  echo "  ✓ Frontend (port $WEB_PORT) — UP"
else
  echo "  ✗ Frontend (port $WEB_PORT) — DOWN or not ready"
fi
