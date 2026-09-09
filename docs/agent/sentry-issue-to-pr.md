# Sentry issue to draft PR

Manual, on-machine workflow. Paste a Sentry issue or event into an agent. The agent implements on a `sentry/*` branch, tests, and opens a **draft** pull request. No webhooks, no unattended daemon, no merge.

This document is the contract. [`AGENTS.md`](../../AGENTS.md) points here so any agent that reads repository agent notes follows the same steps with no extra IDE config.

Before `gh pr create`, run `node scripts/agent/pre-pr-scan.mjs`.

## Agent A (implement)

1. **Redact the payload before using it.** Keep stack traces, routes, breadcrumbs (`from` / `to`, HTTP status). Strip emails, cookies, `Authorization`, session tokens, and any `.env` values. Do not read `.env` or `.env.*`.

2. **Reproduce in a test first** when the failure is deterministic (invalid date, empty form steps, missing query).

3. **Keep the patch simple.** Prefer a small change a human can follow in review over a framework, extra abstraction, or a drive-by refactor. If you notice a wider issue or a possible follow-up, **do not implement it** unless it is required to stop this Sentry error — put it in **Follow-up** on the PR.

4. **Write the analysis for humans.** Fill **Analysis** in plain language: what threw (or failed), the evidence (stack / breadcrumb / code path), why that happens, and what the patch does. Short beats clever. A reviewer must be able to verify the story from the PR + diff alone.

5. **Branch** `sentry/<short-issue-id>-<slug>` from the repository default branch (`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`). Never commit to `main` or `development`.

6. **Jest:** run targeted specs for files you touch, then `npm test` (Jest + `tsc --noEmit`).

7. **Cypress with HTTP mocks (mapped spec, not the full suite).** Map the stack / page path to `cypress/e2e/**` excluding `cypress/e2e/local/` (example: `pages/apply/[resident]/[section].tsx` → `cypress/e2e/pages/apply/[resident]/[section].cy.ts`). Run with `E2E_HTTP_MOCKS=true` and `--spec` only (`npm run e2e:run -- --spec '<path>'`). Never set `LOCAL_E2E`. Never run `npm run e2e:run:local`, `npm run cypress:open:local`, or the LocalStack backend — those are **human-only** (see PR Tests). If no mocked spec maps, add or extend one under `cypress/e2e/` (not `local/`), then run it. If Next cannot start locally, say so in the PR and rely on the slim CircleCI job on `sentry/*` — do not omit that fact.

8. **Commits must pass Husky.** Do not use `--no-verify`, `--no-gpg-sign`, or empty commits. **pre-commit** runs `lint-staged`, `npm test`, Cypress component tests, and `ggshield secret scan pre-commit`. **commit-msg** runs commitlint ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), e.g. `fix: …` / `chore: …`). If a hook fails, fix the issue and create a **new** commit — do not amend around a failed hook.

9. **Stop** (no PR) if the change needs more than about eight files, cannot be isolated, looks like infrastructure, or is “person missing from the API payload” with no UI bug.

10. **Do not add dependencies** unless the human explicitly allows it. If `package-lock.json` changes without that permission, hard stop. Remind them of package cooldown and `npm audit`. Never `git push --force` or push to `main` / `development`.

11. Run `node scripts/agent/pre-pr-scan.mjs` before `gh pr create`. Fix findings or stop.

## Agent B (review only)

New conversation, a **different model**, **no edits**. Input: the diff, the Sentry URL, and this document.

Check that **Analysis** is short and evidenced, the patch is no larger than the brief, and **Follow-up** is notes only (not extra commits). Also require **Solves**, **Does not solve**, **Reproduce**, and **Agent run**. If B rejects, A gets **one** retry; then a human takes over.

## Draft PR

Use `.github/PULL_REQUEST_TEMPLATE/sentry.md` as the body. Fill every section, including **Analysis**, **Follow-up**, and **Agent run**.

```bash
gh pr create --draft --title "…" --body-file .github/PULL_REQUEST_TEMPLATE/sentry.md
```

Never merge.

## Cypress vs CI

- **Agent:** one mapped mocked spec via `npm run e2e:run`. Do not run the viewport matrix, LocalStack, or `cypress/e2e/local/`.
- **Human:** LocalStack / local backend verification in the PR Tests section ([housing-register-local-backend](https://github.com/LBHackney-IT/housing-register-local-backend)).
- **CI:** `sentry/*` branches run `run-cypress-e2e` once (Chrome, 768×1366, file parallelism). `development` and `main` keep the full browser/viewport matrix. Deploys are unchanged.
