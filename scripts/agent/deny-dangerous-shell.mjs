#!/usr/bin/env node
/**
 * Block force-push, pushes to main/development, printenv, and non-allowlisted curl/wget.
 *
 * Cursor (`.cursor/hooks.json` → `beforeShellExecution`): JSON on stdin
 * `{ "command": "…" }` → `{ permission: "allow" | "deny", … }`.
 *
 * Optional CLI for tests: `node scripts/agent/deny-dangerous-shell.mjs --pre-push`
 * (git pre-push ref lines on stdin). Not wired into Husky.
 */
import { execSync } from 'node:child_process';

export const ZERO_SHA = '0'.repeat(40);

const ALLOWED_HOST =
  /(?:^|[/.])(?:github\.com|githubusercontent\.com|npmjs\.org|registry\.npmjs\.org|sentry\.io|hackney\.gov\.uk)(?:[:/]|$)/i;

const PROTECTED_BRANCH = /^(?:refs\/heads\/)?(main|development)$/;

export function evaluateCommand(command) {
  const text = String(command ?? '');
  if (/\bgit\s+push\s+.*--force(-with-lease)?\b/.test(text)) {
    return {
      ok: false,
      message: 'Force push is not allowed.',
      agentMessage: 'Do not git push --force.',
    };
  }
  if (
    /\bgit\s+push\b/.test(text) &&
    /\b(origin\s+)?(main|development)\b/.test(text)
  ) {
    return {
      ok: false,
      message: 'Pushing to main or development is not allowed.',
      agentMessage: 'Push a sentry/* branch and open a draft PR.',
    };
  }
  if (/\bprintenv\b/.test(text) || /\benv\s*$/.test(text.trim())) {
    return {
      ok: false,
      message: 'Dumping the environment is not allowed.',
      agentMessage: 'Do not printenv or dump env.',
    };
  }
  if (/\b(curl|wget)\b/.test(text)) {
    const urls = text.match(/https?:\/\/[^\s"'\\]+/g) ?? [];
    const disallowed = urls.find((url) => !ALLOWED_HOST.test(url));
    if (urls.length === 0 || disallowed) {
      return {
        ok: false,
        message: 'Network fetch is limited to allowlisted hosts.',
        agentMessage:
          'Only curl/wget github.com, npm, sentry.io, or hackney.gov.uk unless a human allows otherwise.',
      };
    }
  }
  return { ok: true };
}

export function evaluatePushLine(
  line,
  { isAncestor } = {
    isAncestor: (remoteSha, localSha) => {
      try {
        execSync(`git merge-base --is-ancestor ${remoteSha} ${localSha}`, {
          stdio: 'ignore',
        });
        return true;
      } catch {
        return false;
      }
    },
  },
) {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 4) return { ok: true };
  const [, localSha, remoteRef, remoteSha] = parts;
  const branch = remoteRef.replace(/^refs\/heads\//, '');

  if (PROTECTED_BRANCH.test(remoteRef) || PROTECTED_BRANCH.test(branch)) {
    return {
      ok: false,
      message: `Pushing to ${branch} is not allowed.`,
      agentMessage: 'Push a sentry/* branch and open a draft PR.',
    };
  }

  if (localSha === ZERO_SHA) {
    return { ok: true };
  }

  if (remoteSha !== ZERO_SHA && !isAncestor(remoteSha, localSha)) {
    return {
      ok: false,
      message: 'Force push is not allowed.',
      agentMessage: 'Do not git push --force.',
    };
  }

  return { ok: true };
}

export function evaluatePushStdin(stdin, options) {
  for (const line of stdin.split('\n')) {
    if (!line.trim()) continue;
    const result = evaluatePushLine(line, options);
    if (!result.ok) return result;
  }
  return { ok: true };
}

function printJson(result) {
  if (result.ok) {
    process.stdout.write(JSON.stringify({ permission: 'allow' }));
    return;
  }
  process.stdout.write(
    JSON.stringify({
      permission: 'deny',
      user_message: result.message,
      agent_message: result.agentMessage,
    }),
  );
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
 * @param {(text: string) => unknown} [opts.write]
 * @param {(text: string) => unknown} [opts.writeErr]
 */
export async function runDenyDangerousShell({
  argv = process.argv.slice(2),
  stdin,
  write = (text) => process.stdout.write(text),
  writeErr = (text) => console.error(text),
} = {}) {
  const raw = stdin ?? (await readStdin());

  if (argv.includes('--pre-push')) {
    const result = evaluatePushStdin(raw);
    if (!result.ok) {
      writeErr(result.message);
      return 1;
    }
    return 0;
  }

  let payload = {};
  try {
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch {
    write(JSON.stringify({ permission: 'allow' }));
    return 0;
  }

  const result = evaluateCommand(payload.command ?? payload.cmd ?? '');
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

const invokedDirectly = process.argv[1]?.endsWith('deny-dangerous-shell.mjs');
if (invokedDirectly) {
  runDenyDangerousShell().then((code) => {
    process.exit(code);
  });
}
