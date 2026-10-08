#!/usr/bin/env node
/**
 * Run before `gh pr create` (playbook). Checks lockfile churn, secret-like diffs,
 * and GitGuardian (ggshield) when files are staged. Also runs the 80%
 * new-code coverage gate after tests.
 */
import { execSync } from 'node:child_process';

const SECRET_LINE =
  /(?:BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-)/;

function git(args) {
  return execSync(`git ${args}`, { encoding: 'utf8' }).trim();
}

let failed = false;

function fail(message) {
  console.error(message);
  failed = true;
}

function changedFiles() {
  const names = new Set();
  for (const args of [
    'diff --name-only',
    'diff --name-only --cached',
    'diff --name-only @{upstream}...HEAD',
  ]) {
    try {
      for (const name of git(args).split('\n')) {
        if (name) names.add(name);
      }
    } catch {
      // no upstream or empty range
    }
  }
  return names;
}

const lockChanged = [...changedFiles()].some(
  (name) => name === 'package-lock.json' || name.endsWith('/package-lock.json'),
);

if (lockChanged && process.env.SENTRY_AUTOFIX_ALLOW_DEPS !== 'true') {
  fail(
    'package-lock.json changed. Default is no new dependencies. Set SENTRY_AUTOFIX_ALLOW_DEPS=true after human approval, cooldown, and npm audit.',
  );
}

let diff = '';
try {
  diff = execSync('git diff --cached && git diff', { encoding: 'utf8' });
} catch {
  diff = '';
}

for (const line of diff.split('\n')) {
  if (
    line.startsWith('+') &&
    !line.startsWith('+++') &&
    SECRET_LINE.test(line)
  ) {
    fail(
      'Diff looks like it contains a secret. Remove it before opening a PR.',
    );
    break;
  }
}

const staged = git('diff --cached --name-only');
if (staged) {
  try {
    execSync('ggshield secret scan pre-commit', { stdio: 'inherit' });
  } catch (error) {
    const missing = error && (error.code === 'ENOENT' || error.status === 127);
    if (missing) {
      fail(
        'ggshield is required (same as the pre-commit hook). Install GitGuardian ggshield.',
      );
    } else {
      fail('ggshield reported findings or failed.');
    }
  }
}

try {
  execSync('git ls-files --error-unmatch .env', { stdio: 'ignore' });
  fail('.env must not be tracked.');
} catch {
  // not tracked
}

try {
  execSync('node scripts/agent/new-code-coverage.mjs', { stdio: 'inherit' });
} catch {
  fail(
    'New production source is under 80% Jest coverage (statements and branches). Add tests, then re-run npm test.',
  );
}

if (failed) {
  process.exit(1);
}

console.log('pre-pr-scan: ok');
