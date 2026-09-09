## Sentry

- Issue:
- Event:
- Fingerprint:

## Analysis

Short enough for a human to check in review. Use the evidence, not speculation.

- What failed:
- Evidence (stack, breadcrumb, file/function):
- Why that happens:
- What this patch changes (and why that is enough):

## Change

## Solves

## Does not solve

## Follow-up

Issues or possible fixes noticed while working, **outside this brief**. Do not ship them in this PR. `none` if nothing.

- Investigate:
- Optional approach (if obvious, one or two sentences):

## Reproduce (manual)

How a reviewer repeats the production failure (and confirms the fix) without Sentry:

1. Setup (mocked Cypress vs LocalStack — say which):
2. Steps:
3. Expected before the fix:
4. Expected after the fix:

## Tests

- Jest:
- Cypress with HTTP mocks (`npm run e2e:run -- --spec …`):
- Slim CI on `sentry/*` (Chrome 768×1366): awaiting / not applicable because:
- **Human only — LocalStack / local backend** ([housing-register-local-backend](https://github.com/LBHackney-IT/housing-register-local-backend)): run `npm run dev` with `HOUSING_REGISTER_API` pointing at the local API, then the reproduce steps (or `npm run e2e:run:local` / `npm run cypress:open:local` when a local spec exists). The implementing agent must not run this. Reviewer: done / not run because:

## Agent run

- Implementer model:
- Reviewer model:
- Tokens / cost (from the tool if reported; otherwise `unknown`):

## Security

- New dependencies: no / yes (human approved, cooldown + `npm audit`):
- Auth or PII files touched:
