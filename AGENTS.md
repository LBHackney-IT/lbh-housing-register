# Agent notes

When the user pastes a **Sentry** issue, event, or stack trace and wants a fix or pull request, follow [docs/agent/sentry-issue-to-pr.md](docs/agent/sentry-issue-to-pr.md). Use the PR body in [.github/PULL_REQUEST_TEMPLATE/sentry.md](.github/PULL_REQUEST_TEMPLATE/sentry.md).

**Guards (Cursor only):** [`.cursor/hooks.json`](.cursor/hooks.json) runs `scripts/agent/deny-dangerous-shell.mjs` on `beforeShellExecution` and `scripts/agent/secret-path-gate.mjs` on `beforeReadFile`. These do not run in Husky — normal commits and pushes are unchanged. Other agents follow the same rules from the playbook.

**New code coverage:** added production source, and added lines in modified production source, must have at least **80%** Jest coverage (statements and branches). Do not commit a PR-ready change until `npm test` and `node scripts/agent/new-code-coverage.mjs` both pass. Specs, Cypress, docs, and `testUtils` are excluded from the gate.
