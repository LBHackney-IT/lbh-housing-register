<!-- agent-generated: docs/agent/sentry-issue-to-pr.md -->

> 🤖 Raised by an agent from a Sentry issue, following [docs/agent/sentry-issue-to-pr.md](../../docs/agent/sentry-issue-to-pr.md). Draft until a human has reviewed it.

## Sentry

- Issue:
- Event:
- Fingerprint:

## Issue

What failed, the evidence (stack, breadcrumb, file/function), and why that happens in this code path. Evidence, not speculation.

## Changes

What this patch changes, why that is enough to stop the error, and what it solves.

## Issues for Review

Anything this PR leaves broken, plus issues noticed while working that are outside the brief. Notes only — do not ship them here. `none` if nothing.

## Steps to Reproduce

1.
2.
3.

- Before the fix:
- After the fix:

## Tests

- [ ] Jest — `npm test` (Jest + `tsc --noEmit`):
- [ ] New-code coverage — `node scripts/agent/new-code-coverage.mjs` (≥80% statements and branches on added production source / added lines):
- [ ] Cypress with HTTP mocks — `npm run e2e:run -- --spec …`:
- [ ] Slim CI on `sentry/*` (Chrome 768×1366):
- [ ] **Human only — LocalStack / local backend** ([housing-register-local-backend](https://github.com/LBHackney-IT/housing-register-local-backend)): `npm run dev` with `HOUSING_REGISTER_API` pointing at the local API, then the reproduce steps (or `npm run e2e:run:local` / `npm run cypress:open:local` when a local spec exists). The implementing agent must not run this.

## Agent run

- Implementer model (self-reported):
- Reviewer model (self-reported):
- Review verdict:
- Cursor chat id:
- Commits:
