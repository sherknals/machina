# Machina Agent

The Cloudflare Worker that serves as the AI brain for Machina.

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars`:

```
ANTHROPIC_API_KEY=sk-ant-your-key
BRIDGE_URL=http://localhost:3000
BRIDGE_AUTH_TOKEN=your-bridge-token
API_SECRET=your-ui-password
```

### 3. Run

```bash
npm run dev
```

Open http://localhost:8787

### 4. Deploy

```bash
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put BRIDGE_URL
npx wrangler secret put BRIDGE_AUTH_TOKEN
npx wrangler secret put API_SECRET

npm run deploy
```

Live at `https://machina-agent.<subdomain>.workers.dev`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `BRIDGE_URL` | Bridge URL (tunnel for production) |
| `BRIDGE_AUTH_TOKEN` | Bridge authentication token |
| `API_SECRET` | Web UI password |

## Architecture

```
Browser
    │ API_SECRET
    ▼
Cloudflare Worker (machina-agent.workers.dev)
    ├──▶ Claude API
    └──▶ Bridge (BRIDGE_URL + BRIDGE_AUTH_TOKEN)
              │
              ▼
         Your Mac
```

## Features

- **Chat Interface** — Terminal-style web UI
- **Scheduling** — "Remind me in 30 minutes"
- **Human-in-the-Loop** — Sensitive actions require confirmation
- **Preferences** — Remembers context

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Chat UI |
| `GET /api` | API info |
| `POST /agents/machina-agent/chat` | Send message |
| `GET /agents/machina-agent/schedules` | List schedules |
| `POST /agents/machina-agent/clear` | Clear history |

All `/agents/*` endpoints require `Authorization: Bearer <API_SECRET>`.

## Development

```bash
npx tsc --noEmit    # Type check
npm run dev         # Local dev
npx wrangler tail   # View logs
```
