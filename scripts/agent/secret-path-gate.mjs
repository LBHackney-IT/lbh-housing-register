#!/usr/bin/env node
/**
 * Block .env, credentials, and pem paths.
 *
 * Cursor (`.cursor/hooks.json` → `beforeReadFile`): JSON on stdin with
 * path-like fields → `{ permission: "allow" | "deny", … }`.
 *
 * Optional CLI for tests: `--staged` / `--changed`. Not wired into Husky.
 */
import { execSync } from 'node:child_process';

export const SECRET_PATH =
  /(?:^|[\\/])(\.env(?:\..*)?|credentials(?:\.json)?|.*\.pem)$/i;

export function collectPaths(value, acc = []) {
  if (typeof value === 'string') {
    if (
      value.includes('/') ||
      value.includes('\\') ||
      /\.(env|pem|json)$/i.test(value) ||
      value.includes('credentials')
    ) {
      acc.push(value);
    }
    return acc;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectPaths(item, acc);
    return acc;
  }
  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (/path|file|uri/i.test(key) && typeof nested === 'string') {
        acc.push(nested);
        continue;
      }
      collectPaths(nested, acc);
    }
  }
  return acc;
}

export function isSecretPath(path) {
  const normalised = path.replace(/\\/g, '/');
  return SECRET_PATH.test(normalised);
}

export function findBlockedPath(paths) {
  return paths.find(isSecretPath) ?? null;
}

function gitNames(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
}

export function listGitNames(mode, gitFn = gitNames) {
  if (mode === 'staged') {
    return gitFn('diff --cached --name-only');
  }
  const names = [
    ...gitFn('diff --name-only'),
    ...gitFn('diff --name-only --cached'),
  ];
  try {
    names.push(...gitFn('diff --name-only @{upstream}...HEAD'));
  } catch {
    // no upstream
  }
  return names;
}

export function evaluateNamedFiles(names) {
  const blocked = findBlockedPath(names);
  if (!blocked) return { ok: true };
  return {
    ok: false,
    message: `Blocked access to secret path: ${blocked}`,
    agentMessage:
      'Do not read or write .env, credentials, or pem files. Redact Sentry payloads instead.',
  };
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

/**
 * @param {object} [opts]
 * @param {string[]} [opts.argv]
 * @param {string} [opts.stdin]
 * @param {string[]} [opts.names]
 * @param {(text: string) => unknown} [opts.write]
 * @param {(text: string) => unknown} [opts.writeErr]
 */
export async function runSecretPathGate({
  argv = process.argv.slice(2),
  stdin,
  names,
  write = (text) => process.stdout.write(text),
  writeErr = (text) => console.error(text),
} = {}) {
  if (argv.includes('--staged') || argv.includes('--changed')) {
    const mode = argv.includes('--staged') ? 'staged' : 'changed';
    const fileNames = names ?? listGitNames(mode);
    const result = evaluateNamedFiles(fileNames);
    if (!result.ok) {
      writeErr(result.message);
      return 1;
    }
    return 0;
  }

  const raw = stdin ?? (await readStdin());
  let payload = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    write(JSON.stringify({ permission: 'allow' }));
    return 0;
  }

  const result = evaluateNamedFiles(collectPaths(payload));
  if (result.ok) {
    write(JSON.stringify({ permission: 'allow' }));
    return 0;
  }
  write(
    JSON.stringify({
      permission: 'deny',
      user_message: result.message,
      agent_message: result.agentMessage,
    }),
  );
  return 0;
}

const invokedDirectly = process.argv[1]?.endsWith('secret-path-gate.mjs');
if (invokedDirectly) {
  runSecretPathGate().then((code) => {
    process.exit(code);
  });
}
