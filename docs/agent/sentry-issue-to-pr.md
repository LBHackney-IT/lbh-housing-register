# Sentry issue to draft PR

Manual, on-machine workflow. Paste a Sentry issue or event into an agent. The agent implements on a `sentry/*` branch, tests, and opens a **draft** pull request. No webhooks, no unattended daemon, no merge.

This document is the contract. [`AGENTS.md`](../../AGENTS.md) points here so any agent that reads repository agent notes follows the same steps with no extra IDE config.

Before `gh pr create`, run `node scripts/agent/pre-pr-scan.mjs` and the [Agent B](#agent-b-review-only) review.

## Agent A (implement)

1. **Redact the payload before using it.** Keep stack traces, routes, breadcrumbs (`from` / `to`, HTTP status). Strip emails, cookies, `Authorization`, session tokens, and any `.env` values. Do not read `.env` or `.env.*`.

2. **Reproduce in a test first** when the failure is deterministic (invalid date, empty form steps, missing query).

3. **Keep the patch simple.** Prefer a small change a human can follow in review over a framework, extra abstraction, or a drive-by refactor. If you notice a wider issue or a possible follow-up, **do not implement it** unless it is required to stop this Sentry error — put it in **Issues for Review** on the PR.

4. **Write the analysis for humans.** Fill **Issue** (what threw or failed, with the stack / breadcrumb / code path as evidence, and why that happens in this code path) and **Changes** (what the patch does and what it solves) in plain language. Short beats clever. A reviewer must be able to verify the story from the PR + diff alone.

5. **Branch** `sentry/<short-issue-id>-<slug>` from the repository default branch (`gh repo view --json defaultBranchRef --jq .defaultBranchRef.name`). Never commit to `main` or `development`.

6. **Jest:** run targeted specs for files you touch, then `npm test` (Jest + `tsc --noEmit`). **New code must have at least 80% Jest coverage** (statements and branches): whole file for added production source, added lines only for modified production source. After `npm test`, run `node scripts/agent/new-code-coverage.mjs`. If it fails, add tests and stop — do not open a PR. Specs, Cypress, docs, and `testUtils` are excluded.

7. **Cypress with HTTP mocks (mapped spec, not the full suite).** Map the stack / page path to `cypress/e2e/**` excluding `cypress/e2e/local/` (example: `pages/apply/[resident]/[section].tsx` → `cypress/e2e/pages/apply/[resident]/[section].cy.ts`). Run with `E2E_HTTP_MOCKS=true` and `--spec` only (`npm run e2e:run -- --spec '<path>'`). Never set `LOCAL_E2E`. Never run `npm run e2e:run:local`, `npm run cypress:open:local`, or the LocalStack backend — those are **human-only** (see PR Tests). If no mocked spec maps, add or extend one under `cypress/e2e/` (not `local/`), then run it. If Next cannot start locally, say so in the PR and rely on the slim CircleCI job on `sentry/*` — do not omit that fact.

8. **Commits must pass Husky.** Do not use `--no-verify`, `--no-gpg-sign`, or empty commits. **pre-commit** runs `lint-staged`, `npm test`, Cypress component tests, and `ggshield secret scan pre-commit`. **commit-msg** runs commitlint ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), e.g. `fix: …` / `chore: …`). If a hook fails, fix the issue and create a **new** commit — do not amend around a failed hook. Cursor agents also load [`.cursor/hooks.json`](../../.cursor/hooks.json): `deny-dangerous-shell.mjs` on shell, `secret-path-gate.mjs` on file reads. Those hooks are Cursor-only.

9. **Stop** (no PR) if the change needs more than about eight files, cannot be isolated, looks like infrastructure, or is “person missing from the API payload” with no UI bug.

10. **Do not add dependencies** unless the human explicitly allows it. If `package-lock.json` changes without that permission, hard stop. Remind them of package cooldown and `npm audit`. Never `git push --force` or push to `main` / `development`.

11. Run `node scripts/agent/pre-pr-scan.mjs` (this includes the 80% new-code coverage gate), then the **Agent B** review below, before `gh pr create`. Fix findings or stop.

## Agent B (review only)

Agent A launches this — it is not a human step and not optional. Use a review subagent on a **different model** from the implementer (for example Claude Sonnet 5 or GPT-5.6 when the implementer was Grok), with **no edits**. Give it the diff, the Sentry URL, and this document, and tell it to return a verdict of approve or reject with reasons.

Check that **Issue** and **Changes** are short and evidenced, the patch is no larger than the brief, and **Issues for Review** is notes only (not extra commits). Also require **Steps to Reproduce**, **Tests**, and **Agent run**. Reject if new production source is under 80% Jest coverage (statements and branches), or if **Tests** does not record the coverage gate.

Record the reviewer model and the verdict in **Agent run**. Do not open the PR while the verdict is a rejection: A gets **one** retry (fix, then re-review); after that a human takes over.

## Draft PR

Use `.github/PULL_REQUEST_TEMPLATE/sentry.md` as the body. Fill every section, and keep the agent watermark (the HTML comment and the 🤖 line) at the top so the PR is identifiable as agent work.

Cursor does not expose the model, token count, or cost to the agent, so **Agent run** records the self-reported models, the review verdict, the Cursor chat id, and the commit SHAs — no token or cost figures.

Apply the `agent-generated` label so agent PRs can be filtered in GitHub (create it once with `gh label create agent-generated --description "Raised by an agent" --color ededed`).

```bash
gh pr create --draft --label agent-generated --title "…" --body-file .github/PULL_REQUEST_TEMPLATE/sentry.md
```

Never merge.

## Cypress vs CI

- **Agent:** one mapped mocked spec via `npm run e2e:run`. Do not run the viewport matrix, LocalStack, or `cypress/e2e/local/`.
- **Human:** LocalStack / local backend verification in the PR Tests section ([housing-register-local-backend](https://github.com/LBHackney-IT/housing-register-local-backend)).
- **CI:** `sentry/*` branches run `run-cypress-e2e` once (Chrome, 768×1366, file parallelism). `development` and `main` keep the full browser/viewport matrix. Deploys are unchanged.
