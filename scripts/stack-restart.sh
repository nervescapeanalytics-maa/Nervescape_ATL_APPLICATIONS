#!/usr/bin/env bash
# ============================================================
# stack-restart.sh — Stop → Start (no rebuild)
# Usage: ./stack-restart.sh          (fast restart, no rebuild)
#        ./stack-restart.sh --build  (rebuild images then start)
# ============================================================
set -euo pipefail

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_USER="appuser"

if [ "$(id -un)" = "root" ]; then
  exec su - "$APP_USER" -s /bin/bash -c "bash '${SCRIPTS_DIR}/stack-restart.sh' $*"
fi

echo "[stack-restart] ── Stopping stack ──"
bash "$SCRIPTS_DIR/stack-stop.sh"

echo ""
echo "[stack-restart] ── Starting stack ──"
bash "$SCRIPTS_DIR/stack-start.sh" "${1:-}"

echo "[stack-restart] Done ✓"
