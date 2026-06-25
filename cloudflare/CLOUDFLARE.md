# Cloudflare Tunnel — public access for Nervescape LMS

This stack exposes the LMS through **Cloudflare Tunnel** (`cloudflared`) in Docker. Traffic hits your Cloudflare hostname, tunnels to the `robofrontend` container (nginx on port 80), which serves the React app and proxies `/api` to the backend.

**Production hostname:** `robotinkerpreneur.com` — see **[ROBOTINKERPRENEUR-FIX.md](ROBOTINKERPRENEUR-FIX.md)** if the site still shows GoDaddy Website Builder.

> **Spelling:** The correct domain is **robotinkerpreneur.com** (`tinker` + `preneur`). A common typo is `robotinkorpreneur.com` — that hostname is not configured and will not resolve to this app.

Local-only access (no tunnel): `http://localhost:${WEB_PORT}` (default **8080**).

---

## Quick start (recommended: tunnel token)

1. In [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) → **Networks** → **Tunnels** → **Create a tunnel** → choose **Docker**.
2. Copy the **tunnel token** and add to `APP_HOME/.env`:
   ```bash
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...
   ```
3. In the tunnel’s **Public Hostname** tab, add a route:
   | Field | Value |
   |-------|--------|
   | Subdomain | e.g. `lms` (or `@` for apex) |
   | Domain | your zone, e.g. `example.com` |
   | Service type | HTTP |
   | URL | `http://robofrontend:80` |
4. Start the stack **with the cloudflare profile**:
   ```bash
   bash scripts/compose.sh --profile cloudflare up -d
   ```
5. Open `https://lms.example.com` (or the hostname you configured).

---

## Alternative: config file + credentials

For multiple hostnames or version-controlled ingress rules:

```bash
cp cloudflare/config.yml.example cloudflare/config.yml
# Edit tunnel UUID and hostname; add credentials.json from cloudflared CLI
bash scripts/compose.sh \
  -f docker-compose.yml \
  -f docker-compose.cloudflare-config.yml \
  --profile cloudflare up -d
```

---

## Configuration checklist (details you need from Cloudflare)

Use this when setting up the tunnel in the dashboard or with `cloudflared` CLI.

### A. Cloudflare account & zone

| Item | Where to get it | Required |
|------|-----------------|----------|
| Cloudflare account | [dash.cloudflare.com](https://dash.cloudflare.com) | Yes |
| Domain (zone) added to Cloudflare | DNS → your domain, nameservers pointed to Cloudflare | Yes (for custom hostname) |
| Zero Trust / Teams | Free plan includes tunnels | Yes |

### B. Tunnel identity

| Item | Where to get it | Used in |
|------|-----------------|---------|
| **Tunnel name** | Zero Trust → Tunnels → Create (e.g. `lms-prod`) | Dashboard / CLI |
| **Tunnel UUID** | Tunnel details page or `cloudflared tunnel list` | `config.yml` (config-file mode) |
| **Tunnel token** | Create tunnel → Docker install snippet | `.env` → `CLOUDFLARE_TUNNEL_TOKEN` |
| **credentials.json** | `cloudflared tunnel create <name>` output | `cloudflare/credentials.json` (config-file mode) |

### C. Public hostname (ingress)

| Item | Example | Notes |
|------|---------|--------|
| **Hostname (FQDN)** | `lms.example.com` | Must be in a zone on your account |
| **Service type** | HTTP | |
| **Origin URL** | `http://robofrontend:80` | Hostname is the **compose service name**, not `localhost` |
| **Path** | (empty) or `/` | Optional path-based routes |

### D. DNS

| Item | Notes |
|------|--------|
| CNAME to tunnel | Usually auto-created when you add a public hostname in Zero Trust |
| Proxy status | Orange cloud (proxied) — default for tunnel routes |

**Duplicate DNS error** (`An A, AAAA, or CNAME record with that host already exists`): this is **not** fixed by changing the origin URL. In **DNS → Records**, delete or edit the existing record for that hostname (e.g. `lms`), or use a **different subdomain** in the tunnel public hostname. Then add the tunnel route again.

### E. Application `.env` (this server)

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDFLARE_TUNNEL_TOKEN` | Yes (token mode) | From tunnel create / Docker install |
| `WEB_PORT` | No (local only) | Default `8080`; tunnel does not need host port published |
| `API_PORT` | No (tunnel) | API reached via nginx `/api` on frontend |

### F. Optional Cloudflare settings

| Setting | Recommendation |
|---------|----------------|
| **SSL/TLS mode** | Full (strict) if you only use HTTPS to origin; tunnel to HTTP `robofrontend:80` is fine |
| **Access policies** | Zero Trust → Access → protect `/admin` etc. if needed |
| **WAF / Bot Fight** | Enable per zone as needed |
| **HTTP Host header** | Default; match your public hostname |

### G. What you do **not** need on this host

- Inbound firewall ports 80/443 for the LMS (tunnel is outbound-only from `cloudflared`)
- A public IP on the application server (unless you also want direct access)

---

## Verify

```bash
bash scripts/compose.sh --profile cloudflare ps
bash scripts/compose.sh logs cloudflared
```

Healthy logs include `Connection registered` and your tunnel UUID.

---

## Restore point

Before enabling Cloudflare, a restore point was saved under `.backups/cloudflare_pre_*` and git tag `restore/cloudflare-pre-20260604`.

```bash
bash scripts/restore-from-point.sh .backups/cloudflare_pre_20260604_124255
# or: git checkout restore/cloudflare-pre-20260604 -- docker-compose.yml
```

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| 502 / origin error | `robofrontend` container up; public hostname URL is `http://robofrontend:80` |
| Duplicate DNS record | Remove conflicting A/AAAA/CNAME in **DNS → Records**, or pick another subdomain |
| Tunnel not connecting | Valid `CLOUDFLARE_TUNNEL_TOKEN`; profile `cloudflare` used on `up` |
| API 404 from browser | Use same hostname for UI and API (nginx proxies `/api`) |
| Login works locally but not via tunnel | Cookies/CORS if you hard-coded `localhost` in frontend (this app uses relative `/api`) |
