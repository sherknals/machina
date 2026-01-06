# Production Readiness & Ops Runbook

This document focuses on **safe, minimal steps** to run Machina in production-like conditions (stable, secure, observable, and recoverable) without large refactors.

## 1) Required Configuration

### Bridge (Mac)
- **Auth token**: `machina.config.json` (created by `npm run setup`) or `BRIDGE_AUTH_TOKEN` env var.
- **Bind host**: default `127.0.0.1` (local only). Set `HOST=0.0.0.0` only if you explicitly need LAN exposure.
- **Port**: `PORT` (default `3000`).
- **Proxy IPs**: set `TRUST_PROXY=1` if the Bridge sits behind a reverse proxy/tunnel and you want real client IPs for rate limiting/logs.

### Agent (Cloudflare Worker)
Required secrets:
- `ANTHROPIC_API_KEY`
- `BRIDGE_URL`
- `BRIDGE_AUTH_TOKEN`
- `API_SECRET`

Set with:
```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put BRIDGE_URL
npx wrangler secret put BRIDGE_AUTH_TOKEN
npx wrangler secret put API_SECRET
```

## 2) Deployment Modes

### Local only (no remote access)
```bash
npm run setup
npm start
```
Access Bridge at `http://localhost:3000`.

### Remote access (Cloudflare tunnel)
- Start bridge with tunnel (via `npm start`) and ensure `cloudflared` is installed.
- Prefer keeping Bridge bound to `127.0.0.1` unless LAN access is needed.

### Deployed UI (Cloudflare Worker)
```bash
cd cloudflare-agent
npm install
npm run deploy
```

## 3) Health Checks

### Bridge (local)
- `GET /health` (no auth)
- `GET /metrics` (auth)

### Agent (cloud)
- `GET /agents/machina-agent/health` (auth)

## 4) Monitoring & Logs

### Bridge
- Default logs go to stdout.
- Use a process manager (e.g., `launchd`) to capture and rotate logs.
- `GET /metrics` provides basic counters.

### Agent (Cloudflare)
- Use `wrangler tail` for live logs.
- Configure Cloudflare alerts for 5xx error spikes and latency.

## 5) Backups & Recovery

### What to back up
- `machina.config.json` (contains auth token + extensions config).
- List of schedules from `GET /agents/machina-agent/schedules`.

### Recovery steps
1. Restore `machina.config.json`.
2. Re-set Cloudflare secrets if needed.
3. Re-deploy Worker and restart Bridge.
4. Recreate schedules (if required).

## 6) Rollback

1. Revert to a previous git tag/commit.
2. Run `npm run build` (root + agent if changed).
3. Re-deploy Worker (if applicable).
4. Restart Bridge.

## 7) Security Baseline

- Keep tokens out of logs and version control.
- Use Cloudflare Access if exposing UI publicly.
- Restrict Bridge to `127.0.0.1` when possible.
- Rotate secrets on suspected compromise.
- Regularly update dependencies.

---

## Quick Checklist (Before Go-Live)

- [ ] `machina.config.json` created and stored securely
- [ ] Cloudflare secrets set (agent)
- [ ] Bridge health passes
- [ ] Agent health passes
- [ ] Observability: logs + metrics accessible
- [ ] Backup plan for config + schedules
- [ ] Rollback procedure tested
