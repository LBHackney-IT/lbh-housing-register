#!/usr/bin/env node
/**
 * Non-blocking preflight for GitHub-dependent workflow steps.
 *
 * This only checks local CLI authentication and repository configuration.
 * It never prints credentials, contacts Sentry, or blocks local agent work.
 */
import { spawnSync } from 'node:child_process';

function defaultRun(command, args) {
  return spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

export function checkGithubPreflight(run = defaultRun) {
  const warnings = [];
  const ghVersion = run('gh', ['--version']);

  if (ghVersion.error?.code === 'ENOENT' || ghVersion.status !== 0) {
    warnings.push(
      'GitHub CLI (gh) is not available. Install it before pushing or opening the draft PR.',
    );
  } else {
    const auth = run('gh', ['auth', 'status', '--hostname', 'github.com']);
    if (auth.status !== 0) {
      warnings.push(
        'GitHub CLI is not authenticated for github.com. Run `gh auth login`; local diagnosis and tests can continue.',
      );
    } else {
      const permission = run('gh', [
        'repo',
        'view',
        '--json',
        'viewerPermission',
        '--jq',
        '.viewerPermission',
      ]);
      const writable = ['ADMIN', 'MAINTAIN', 'WRITE'].includes(
        permission.stdout?.trim(),
      );
      if (permission.status !== 0 || !writable) {
        warnings.push(
          'GitHub write access for this repository could not be verified. Pushing the branch or opening the draft PR may require different credentials.',
        );
      }
    }
  }

  const origin = run('git', ['remote', 'get-url', 'origin']);
  if (origin.status !== 0 || !origin.stdout?.trim()) {
    warnings.push(
      'This checkout has no `origin` remote. Configure it before pushing or opening the draft PR.',
    );
  }

  return warnings;
}

export function runGithubPreflight({
  run = defaultRun,
  write = console.log,
  writeErr = console.warn,
} = {}) {
  const warnings = checkGithubPreflight(run);

  if (warnings.length === 0) {
    write('github-preflight: ok');
    return 0;
  }

  for (const warning of warnings) {
    writeErr(`github-preflight: warning: ${warning}`);
  }
  writeErr(
    'github-preflight: warning only; continue local work and retry GitHub steps after configuration.',
  );
  return 0;
}

const invokedDirectly = process.argv[1]?.endsWith('github-preflight.mjs');
if (invokedDirectly) {
  process.exit(runGithubPreflight());
}
