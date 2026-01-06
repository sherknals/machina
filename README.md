# Machina

> **Control your Mac from anywhere with AI** — Voice commands, automation, remote access, and 60+ built-in tools.

**AI-Powered Mac Automation Platform | Self-Hosted | Open Source | Privacy-First**

```
 ███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗ █████╗
 ████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔══██╗
 ██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║███████║
 ██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══██║
 ██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║██║  ██║
 ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
```

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)
[![macOS](https://img.shields.io/badge/macOS-Sonoma+-black.svg)](https://www.apple.com/macos)

Machina is a self-hosted AI assistant that gives you complete control over your Mac from anywhere. Speak naturally—play music, send messages, manage files, run commands, and automate workflows with 60+ built-in tools.

## Why Machina?

- 🏠 **Self-Hosted** — Your data stays on your machine, never sent to third parties
- 🔐 **Secure by Design** — Token auth, command allowlists, human-in-the-loop confirmations
- 🌍 **Access Anywhere** — Secure Cloudflare tunnel for remote access from any device
- 🤖 **AI-Powered** — Natural language commands powered by Claude
- ⚡ **60+ Tools** — Music, messages, calendar, files, system control, and more
- 🔌 **Extensible** — Raycast integration, AppleScript, shell commands

## Features

| Category | Capabilities |
|----------|-------------|
| **Music** | Play, pause, skip, search, volume control |
| **Messaging** | Send iMessage with human-in-the-loop confirmation |
| **Calendar** | View, create, and manage events |
| **Reminders** | Create, list, and complete tasks |
| **System** | Volume, brightness, dark mode, lock, sleep |
| **Files** | Search, reveal, trash, clipboard |
| **Automation** | AppleScript, Shell commands, Shortcuts |
| **Raycast** | Execute any installed extension |

## Quick Start

```bash
# Clone
git clone https://github.com/tytsxai/machina.git
cd machina

# Install
npm install

# Setup (interactive wizard)
npm run setup

# Launch
npm start
```

Open the URL displayed and start chatting with your Mac.

## Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| macOS | Sonoma+ | Required |
| Node.js | 18+ | Required |
| Anthropic API Key | — | [Get one here](https://console.anthropic.com) |
| cloudflared | Latest | Optional, for remote access |
| Raycast | Latest | Optional, for extensions |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR DEVICES                                │
│              (iPhone, iPad, MacBook, Browser)                       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE (Optional)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Access    │  │   Worker    │  │   Tunnel    │                 │
│  │  (Auth)     │  │  (AI Brain) │  │  (Secure)   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ Authenticated Request
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MACHINA BRIDGE                                 │
│                      (Your Mac)                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Express   │  │    Tool     │  │  AppleScript│                 │
│  │   Server    │──│   Engine    │──│   Runtime   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

**Local Mode:** Everything runs on your Mac at `localhost:3000`

**Remote Mode:** Secure Cloudflare tunnel enables access from anywhere (no account required)

## Configuration

After setup, your config is saved in `machina.config.json`:

```json
{
  "authToken": "your-secure-token",
  "anthropicKey": "sk-ant-...",
  "mode": "ui",
  "access": "remote",
  "extensions": [...]
}
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Interactive setup wizard |
| `npm start` | Start Machina |
| `npm run dev` | Development mode (bridge only) |
| `npm run mcp` | Start MCP Server (for AI agent integration) |
| `npm run build` | Rebuild TypeScript |

## Security

Machina is built with security-first principles:

- **Authentication** — Bearer token on all endpoints
- **Command Allowlist** — Only safe shell commands permitted
- **Pattern Blocking** — Dangerous operations automatically blocked
- **Human-in-the-Loop** — Sensitive actions require confirmation
- **Zero Trust Ready** — Optional Cloudflare Access integration
- **Self-Hosted** — Your data never leaves your infrastructure

### Recommended: Cloudflare Access

For production deployments, add [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) for Zero Trust authentication:

```hcl
resource "cloudflare_access_application" "machina" {
  zone_id          = var.zone_id
  name             = "Machina"
  domain           = "machina.yourdomain.com"
  session_duration = "24h"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No auth token" | Run `npm run setup` |
| Tunnel not starting | Install cloudflared: `brew install cloudflared` |
| Agent errors | Check `cloudflare-agent/.dev.vars` configuration |

## Advanced Deployment

Deploy the AI agent to Cloudflare Workers for a permanent endpoint:

```bash
cd cloudflare-agent
npm install

# Configure secrets
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put BRIDGE_URL
npx wrangler secret put BRIDGE_AUTH_TOKEN
npx wrangler secret put API_SECRET

# Deploy
npm run deploy
```

## Documentation

- [API Reference](docs/api.md) — Complete endpoint and tool documentation
- [Agent Deployment](cloudflare-agent/README.md) — Cloudflare Worker setup guide
- [Production Readiness](docs/production-ready.md) — Go-live checklist and ops runbook

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Machina</strong> — Your Mac, Everywhere
</p>

---

## Keywords

`mac automation` `ai assistant` `remote control mac` `applescript` `claude ai` `self-hosted` `home automation` `macos tools` `cloudflare workers` `typescript` `raycast` `imessage automation` `calendar automation` `voice control mac`
