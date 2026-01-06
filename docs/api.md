# Machina API Reference

Complete API documentation for the Machina Mac automation platform.

## Overview

Machina exposes two API surfaces:

| Component | Purpose | Default URL |
|-----------|---------|-------------|
| **Agent** | AI chat interface, scheduling | Your deployed Worker URL (e.g. `https://<name>.<account>.workers.dev`) |
| **Bridge** | Tool execution on Mac | `http://localhost:3000` |

## Authentication

### Agent (Cloudflare Worker)
- **HTTP**: `Authorization: Bearer <API_SECRET>`
- **WebSocket**: `?token=<API_SECRET>` (headers aren’t available from browsers)

### Bridge (local Mac)
- **HTTP**: `Authorization: Bearer <BRIDGE_AUTH_TOKEN>`
- **Public**: `GET /health` (no auth)

---

## Agent Endpoints

All Agent endpoints are under the `/agents/machina-agent` prefix.

### POST /agents/machina-agent/chat
Send a natural language message to the AI agent.

**Request:**
```json
{
  "message": "Play some jazz music"
}
```

**Response:**
```json
{
  "message": "Playing jazz on Apple Music",
  "actions": [{
    "tool": "music_play",
    "args": { "query": "jazz" },
    "success": true,
    "result": "Now playing: Jazz Vibes"
  }]
}
```

### POST /agents/machina-agent/execute
Execute a tool directly via the Agent.

**Request:**
```json
{
  "tool": "open_app",
  "args": { "name": "Safari" }
}
```

### POST /agents/machina-agent/reset
Clear conversation history and reset agent state (keeps preferences).

### GET /agents/machina-agent/schedules
List scheduled tasks.

**Response:**
```json
{
  "schedules": [{
    "id": "abc123",
    "time": "0 17 * * *",
    "payload": { "tool": "music_play", "args": { "query": "jazz" }, "description": "Play jazz" },
    "type": "recurring",
    "createdAt": 1736179200000
  }]
}
```

### DELETE /agents/machina-agent/schedules/:id
Cancel a scheduled task.

### GET /agents/machina-agent/state
Debug endpoint for agent state.

**Response:**
```json
{
  "historyLength": 12,
  "preferences": { "name": "John" },
  "pendingAction": null,
  "lastActive": 1736179200000
}
```

### GET /agents/machina-agent/history
Get recent chat history.

### POST /agents/machina-agent/clear
Clear chat history only.

### GET /agents/machina-agent/health
Agent health check.

### WebSocket (real-time updates)
```
wss://<worker-domain>/agents/machina-agent?token=... 
```
Events: `scheduled_result`, `notification`, `chat`, `ping`

---

## Bridge Endpoints

### GET /health
Health check endpoint (no auth).

### GET /tools
List all available tools and input schemas.

### POST /execute
Execute a tool on the Mac.

**Request:**
```json
{
  "tool": "open_app",
  "args": { "name": "Safari" }
}
```

**Response:**
```json
{
  "success": true,
  "result": "Opened: Safari"
}
```

### POST /batch
Execute multiple tools in one request (max 10).

### GET /logs
Get recent execution logs (in-memory).

### GET /metrics
Basic metrics and process stats.

---

## Tools Reference (Selected)

> **Source of truth:** call `GET /tools` to discover all tools and schemas.

### Core Tools
| Tool | Description | Parameters |
|------|-------------|------------|
| `open_app` | Open application | `name: string` |
| `open_url` | Open URL in browser | `url: string` |
| `shell` | Run safe shell command | `command: string` |
| `shell_list` | List available commands | — |
| `applescript` | Execute AppleScript | `script: string` |
| `notify` | Show notification | `title, message: string` |
| `say` | Text-to-speech | `text: string`, `voice?: string` |
| `clipboard_get` | Get clipboard content | — |
| `clipboard_set` | Set clipboard content | `text: string` |
| `screenshot` | Take screenshot | `type?: "full" | "window"` |

### Music Tools
| Tool | Description | Parameters |
|------|-------------|------------|
| `music_play` | Play or search music | `query?: string` |
| `music_pause` | Pause playback | — |
| `music_next` | Next track | — |
| `music_previous` | Previous track | — |
| `music_current` | Current track info | — |
| `volume_get` | Get volume level | — |
| `volume_set` | Set volume level | `level: 0-100` |
| `volume_up` | Increase volume 10% | — |
| `volume_down` | Decrease volume 10% | — |
| `volume_mute` | Toggle mute | — |

### Messaging Tools
| Tool | Description | Parameters |
|------|-------------|------------|
| `search_contacts` | Find contact | `query: string` |
| `send_imessage` | Send iMessage | `to, message: string` |

### Calendar & Reminders
| Tool | Description | Parameters |
|------|-------------|------------|
| `calendar_today` | Today's events | — |
| `calendar_upcoming` | Events for next N days | `days?: number (max 7)` |
| `calendar_next` | Next event | — |
| `calendar_create` | Create event | `title, date, time, duration?: number` |
| `reminders_list` | List reminders | `list?: string`, `completed?: boolean` |
| `reminders_create` | Create reminder | `title: string`, `list?: string`, `dueDate?: string` |
| `reminders_complete` | Complete reminder | `title: string`, `list?: string` |

### System Status
| Tool | Description | Parameters |
|------|-------------|------------|
| `battery_status` | Battery info | — |
| `wifi_status` | WiFi info | — |
| `storage_status` | Disk space | — |
| `running_apps` | Running apps | — |
| `front_app` | Frontmost app | — |

### Display & Focus
| Tool | Description | Parameters |
|------|-------------|------------|
| `brightness_set` | Set brightness | `level: 0-100` |
| `dark_mode_toggle` | Toggle dark mode | — |
| `dark_mode_status` | Get dark mode state | — |
