# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **Do NOT** open a public issue
2. Email: security@machina.dev (or create a private security advisory on GitHub)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Measures

Machina implements multiple security layers:

- **Authentication**: Bearer token on all endpoints
- **Command Allowlist**: Only safe shell commands permitted
- **Pattern Blocking**: Dangerous operations blocked
- **Human-in-the-Loop**: Sensitive actions require confirmation
- **Rate Limiting**: 60 requests/minute per IP
- **Input Validation**: Zod schema validation on all inputs

## Best Practices

1. Keep `machina.config.json` out of version control
2. Use strong, random API secrets
3. Enable Cloudflare Access for production deployments
4. Regularly update dependencies
5. Monitor bridge logs for suspicious activity
