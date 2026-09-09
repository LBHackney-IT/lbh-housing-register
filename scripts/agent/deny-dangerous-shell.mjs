#!/usr/bin/env node
/**
 * Deny dangerous shell for agent sessions. Allowlisted hosts for curl/wget.
 */

const ALLOWED_HOST =
  /(?:^|[/.])(?:github\.com|githubusercontent\.com|npmjs\.org|registry\.npmjs\.org|sentry\.io|hackney\.gov\.uk)(?:[:/]|$)/i;

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

function deny(userMessage, agentMessage) {
  process.stdout.write(
    JSON.stringify({
      permission: 'deny',
      user_message: userMessage,
      agent_message: agentMessage,
    }),
  );
}

const raw = await readStdin();
let payload = {};
try {
  payload = raw.trim() ? JSON.parse(raw) : {};
} catch {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

const command = String(payload.command ?? payload.cmd ?? '');

if (/\bgit\s+push\s+.*--force(-with-lease)?\b/.test(command)) {
  deny('Force push is not allowed.', 'Do not git push --force.');
  process.exit(0);
}

if (
  /\bgit\s+push\b/.test(command) &&
  /\b(origin\s+)?(main|development)\b/.test(command)
) {
  deny(
    'Pushing to main or development is not allowed.',
    'Push a sentry/* branch and open a draft PR.',
  );
  process.exit(0);
}

if (/\bprintenv\b/.test(command) || /\benv\s*$/.test(command.trim())) {
  deny(
    'Dumping the environment is not allowed.',
    'Do not printenv or dump env.',
  );
  process.exit(0);
}

if (/\b(curl|wget)\b/.test(command)) {
  const urls = command.match(/https?:\/\/[^\s"'\\]+/g) ?? [];
  const disallowed = urls.find((url) => !ALLOWED_HOST.test(url));
  if (urls.length === 0 || disallowed) {
    deny(
      'Network fetch is limited to allowlisted hosts.',
      'Only curl/wget github.com, npm, sentry.io, or hackney.gov.uk unless a human allows otherwise.',
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify({ permission: 'allow' }));
