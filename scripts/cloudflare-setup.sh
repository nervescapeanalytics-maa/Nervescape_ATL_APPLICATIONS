#!/usr/bin/env bash
# Provision DNS for the tunnel and validate ingress (run on the host as appuser).
set -euo pipefail

APP_HOME="/home/appuser/APP_HOME"
cd "$APP_HOME"

# shellcheck disable=SC1091
[[ -f .env ]] && set -a && source .env && set +a

TUNNEL_ID="${CLOUDFLARE_TUNNEL_ID:-f4bf9464-dcb9-43f8-91c0-42223e7605cf}"
HOST="${CLOUDFLARE_HOSTNAME:-robotinkerpreneur.com}"
CREDS="$APP_HOME/cloudflare/credentials.json"
CONFIG="$APP_HOME/cloudflare/config.yml"

if [[ ! -f "$CREDS" || ! -f "$CONFIG" ]]; then
  echo "Missing $CREDS or $CONFIG — run from APP_HOME after cloudflare/ is populated." >&2
  exit 1
fi

echo "Validating ingress..."
cloudflared tunnel --config "$CONFIG" ingress validate http://$HOST/

echo "Routing DNS (overwrite conflicting records)..."
cloudflared tunnel --config "$CONFIG" route dns --overwrite-dns "$TUNNEL_ID" "$HOST" || true
cloudflared tunnel --config "$CONFIG" route dns --overwrite-dns "$TUNNEL_ID" "www.$HOST" || true

echo "Done. Start stack: bash scripts/compose.sh --profile cloudflare up -d"
