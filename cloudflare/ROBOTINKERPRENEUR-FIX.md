# Fix robotinkerpreneur.com → LMS (DNS + tunnel)

The tunnel connector on this server is **running** and healthy. The domain still shows the **GoDaddy Website Builder** site because DNS for `@` does not point at the tunnel yet.

## One-time fix in Cloudflare (required)

### Step 1 — DNS (fixes “record already exists” + GoDaddy site)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **robotinkerpreneur.com** → **DNS** → **Records**.
2. For the **apex** (`robotinkerpreneur.com`) and **www**:
   - Delete or edit any **A / AAAA / CNAME** records that point to GoDaddy / Website Builder / parking.
3. Add or update **CNAME** records (orange cloud **Proxied**):

   | Type  | Name | Target |
   |-------|------|--------|
   | CNAME | `@`  | `f4bf9464-dcb9-43f8-91c0-42223e7605cf.cfargotunnel.com` |
   | CNAME | `www`| `f4bf9464-dcb9-43f8-91c0-42223e7605cf.cfargotunnel.com` |

4. If **Websites** / **Website Builder** is connected to this domain, disconnect or remove it so traffic uses the tunnel.

### Step 2 — Tunnel public hostname (origin URL)

1. [Zero Trust](https://one.dash.cloudflare.com/) → **Networks** → **Tunnels** → your tunnel.
2. **Public Hostname** → add or edit:

   | Field | Value |
   |-------|--------|
   | Hostname | `robotinkerpreneur.com` |
   | Service | `http://robofrontend:80` |

   Repeat for `www.robotinkerpreneur.com` if needed.

   Do **not** use `localhost` or `frontend` — the Docker service name is **`robofrontend`**.

### Step 3 — On this server

```bash
cd /home/appuser/APP_HOME
bash scripts/compose.sh --profile cloudflare up -d
```

### Verify

```bash
curl -s https://robotinkerpreneur.com/api/health
# Expected: {"status":"ok","db":"connected",...}
```

## Optional: CLI DNS (after `cloudflared tunnel login`)

```bash
bash scripts/cloudflare-setup.sh
```

## Optional: API DNS (token with Zone.DNS Edit)

```bash
export CLOUDFLARE_API_TOKEN='your-api-token'
bash scripts/cloudflare-dns-api.sh
```
