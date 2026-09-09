#!/usr/bin/env node
/**
 * Shared secret-path checks for agent CLIs (stdin JSON with path-like fields).
 */

const SECRET_PATH =
  /(?:^|[\\/])(\.env(?:\..*)?|credentials(?:\.json)?|.*\.pem)$/i;

function collectPaths(value, acc = []) {
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
      }
      collectPaths(nested, acc);
    }
  }
  return acc;
}

function isSecretPath(path) {
  const normalised = path.replace(/\\/g, '/');
  return SECRET_PATH.test(normalised);
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

const raw = await readStdin();
let payload = {};
try {
  payload = raw.trim() ? JSON.parse(raw) : {};
} catch {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

const paths = collectPaths(payload);
const blocked = paths.find(isSecretPath);

if (blocked) {
  process.stdout.write(
    JSON.stringify({
      permission: 'deny',
      user_message: `Blocked access to secret path: ${blocked}`,
      agent_message:
        'Do not read or write .env, credentials, or pem files. Redact Sentry payloads instead.',
    }),
  );
  process.exit(0);
}

process.stdout.write(JSON.stringify({ permission: 'allow' }));
