#!/usr/bin/env bash
# Point robotinkerpreneur.com (and www) at the Cloudflare Tunnel via API.
# Requires CLOUDFLARE_API_TOKEN with Zone.DNS Edit for the zone.
set -euo pipefail

ZONE_NAME="${CLOUDFLARE_HOSTNAME:-robotinkerpreneur.com}"
TUNNEL_ID="${CLOUDFLARE_TUNNEL_ID:-f4bf9464-dcb9-43f8-91c0-42223e7605cf}"
TARGET="${TUNNEL_ID}.cfargotunnel.com"
API="https://api.cloudflare.com/client/v4"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN (Zone.DNS Edit) and re-run." >&2
  exit 1
fi

auth=(-H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" -H "Content-Type: application/json")

zone_id=$(curl -fsS "${auth[@]}" "$API/zones?name=$ZONE_NAME" | python3 -c "
import json,sys
d=json.load(sys.stdin)
r=d.get('result') or []
print(r[0]['id'] if r else '')
")

if [[ -z "$zone_id" ]]; then
  echo "Zone not found: $ZONE_NAME" >&2
  exit 1
fi

upsert_cname() {
  local name="$1"
  local list
  list=$(curl -fsS "${auth[@]}" "$API/zones/$zone_id/dns_records?type=CNAME,A,AAAA&name=$name")
  local record_id
  record_id=$(echo "$list" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for r in d.get('result') or []:
    print(r['id']); break
")
  local body
  body=$(python3 -c "
import json
print(json.dumps({
  'type': 'CNAME',
  'name': '$name',
  'content': '$TARGET',
  'proxied': True,
  'ttl': 1,
}))
")
  if [[ -n "$record_id" ]]; then
    curl -fsS -X PUT "${auth[@]}" -d "$body" "$API/zones/$zone_id/dns_records/$record_id" >/dev/null
    echo "Updated CNAME $name -> $TARGET"
  else
    curl -fsS -X POST "${auth[@]}" -d "$body" "$API/zones/$zone_id/dns_records" >/dev/null
    echo "Created CNAME $name -> $TARGET"
  fi
}

upsert_cname "$ZONE_NAME"
upsert_cname "www.$ZONE_NAME"
echo "DNS ready. Tunnel ingress must use http://robofrontend:80"
