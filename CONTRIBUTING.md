# Contributing to Machina

Thank you for your interest in contributing to Machina!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/machina.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

```bash
npm run build    # Build TypeScript
npm run dev      # Run bridge locally
npm run setup    # Run setup wizard
```

## Code Style

- TypeScript with strict mode
- Use Zod for validation
- Keep functions focused and small
- Add JSDoc comments for public APIs

## Pull Requests

1. Update tests if applicable
2. Update documentation if needed
3. Ensure `npm run build` passes
4. Write clear commit messages
5. Reference related issues

## Adding Tools

New tools go in `src/bridge/tools.ts`:

```typescript
{
  name: "tool_name",
  description: "What it does",
  inputSchema: z.object({
    param: z.string().describe("Parameter description")
  }),
  handler: async ({ param }) => {
    // Implementation
    return { success: true, result: "..." };
  }
}
```

## Security

- Never commit secrets
- Use allowlists for shell commands
- Validate all inputs with Zod
- Report vulnerabilities privately

## License

By contributing, you agree that your contributions will be licensed under MIT.
