import { describe, it, expect } from 'vitest';

/**
 * Tests for shell command validation logic
 * Extracted patterns from tools.ts for testing
 */

// Blocked paths patterns
const BLOCKED_PATHS = [
  /\.env/i,
  /\.dev\.vars/i,
  /\.ssh/,
  /\.aws/,
  /\.gnupg/,
  /\.gitconfig/,
  /\.npmrc/,
  /\.netrc/,
  /id_rsa/,
  /id_ed25519/,
  /\.pem$/,
  /\.key$/,
  /password/i,
  /secret/i,
  /token/i,
  /credential/i,
  /\/etc\/passwd/,
  /\/etc\/shadow/,
  /keychain/i,
];

// Dangerous patterns
const DANGEROUS_PATTERNS = [
  /rm\s+(-rf?|--recursive)/,
  /rm\s+.*[/*]/,
  /sudo/,
  /su\s/,
  /chmod\s+777/,
  /mkfs/,
  /dd\s+/,
  />\s*\/dev\//,
  /\/etc\/passwd/,
  /\/etc\/shadow/,
  /\|\s*sh/,
  /\|\s*bash/,
  /`.*`/,
  /\$\(.*\)/,
  /&&\s*(rm|sudo|su|chmod|chown)/,
  /;\s*(rm|sudo|su|chmod|chown)/,
];

function containsBlockedPath(args: string[]): boolean {
  const fullArgs = args.join(' ');
  return BLOCKED_PATHS.some(pattern => pattern.test(fullArgs));
}

function containsDangerousPattern(command: string): boolean {
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(command));
}

describe('Security: Blocked Paths', () => {
  it('should block .env files', () => {
    expect(containsBlockedPath(['.env'])).toBe(true);
    expect(containsBlockedPath(['.env.local'])).toBe(true);
    expect(containsBlockedPath(['cat', '.env'])).toBe(true);
  });

  it('should block SSH keys', () => {
    expect(containsBlockedPath(['~/.ssh/id_rsa'])).toBe(true);
    expect(containsBlockedPath(['id_ed25519'])).toBe(true);
  });

  it('should block credential files', () => {
    expect(containsBlockedPath(['.aws/credentials'])).toBe(true);
    expect(containsBlockedPath(['.npmrc'])).toBe(true);
    expect(containsBlockedPath(['.netrc'])).toBe(true);
  });

  it('should block password/secret/token paths', () => {
    expect(containsBlockedPath(['passwords.txt'])).toBe(true);
    expect(containsBlockedPath(['secret.json'])).toBe(true);
    expect(containsBlockedPath(['api_token.txt'])).toBe(true);
  });

  it('should block system files', () => {
    expect(containsBlockedPath(['/etc/passwd'])).toBe(true);
    expect(containsBlockedPath(['/etc/shadow'])).toBe(true);
  });

  it('should allow safe paths', () => {
    expect(containsBlockedPath(['README.md'])).toBe(false);
    expect(containsBlockedPath(['src/index.ts'])).toBe(false);
    expect(containsBlockedPath(['package.json'])).toBe(false);
  });
});

describe('Security: Dangerous Patterns', () => {
  it('should block rm -rf', () => {
    expect(containsDangerousPattern('rm -rf /')).toBe(true);
    expect(containsDangerousPattern('rm -r /home')).toBe(true);
    expect(containsDangerousPattern('rm --recursive')).toBe(true);
  });

  it('should block sudo/su', () => {
    expect(containsDangerousPattern('sudo rm file')).toBe(true);
    expect(containsDangerousPattern('su root')).toBe(true);
  });

  it('should block command injection', () => {
    expect(containsDangerousPattern('echo `whoami`')).toBe(true);
    expect(containsDangerousPattern('echo $(cat /etc/passwd)')).toBe(true);
    expect(containsDangerousPattern('ls | sh')).toBe(true);
    expect(containsDangerousPattern('cat file | bash')).toBe(true);
  });

  it('should block chained dangerous commands', () => {
    expect(containsDangerousPattern('ls && rm -rf /')).toBe(true);
    expect(containsDangerousPattern('echo hi; sudo reboot')).toBe(true);
  });

  it('should allow safe commands', () => {
    expect(containsDangerousPattern('ls -la')).toBe(false);
    expect(containsDangerousPattern('cat README.md')).toBe(false);
    expect(containsDangerousPattern('git status')).toBe(false);
    expect(containsDangerousPattern('pwd')).toBe(false);
  });
});
