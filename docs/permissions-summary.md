# Staff permissions (current implementation)

This describes what this Next.js app allows today. The Cognito/NextAuth cutover changed how staff authenticate, not who can do what. Role checks below are the same rules as the pre-Cognito Google JWT app.

Roles come from Cognito `custom:groups` matched against `AUTHORISED_*_GROUP` env vars (`lib/auth/staff.ts`). They are **independent flags**, not a hierarchy: admin is not a superset of manager.

A user in more than one group gets the union of flags. `hasReadOnlyPermissionOnly` is true only when the read-only group is present **and** admin, manager, and officer are all absent.

Local E2E additionally maps `E2E_AUTHORISED_MANAGER_GROUP` onto `hasManagerPermissions`. That mapping is not used for reports (see below) and is not present in deployed builds.

## Role flags

| Flag                     | Source group env var                                                               |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `hasAdminPermissions`    | `AUTHORISED_ADMIN_GROUP`                                                           |
| `hasManagerPermissions`  | `AUTHORISED_MANAGER_GROUP` (plus `E2E_AUTHORISED_MANAGER_GROUP` in local E2E only) |
| `hasOfficerPermissions`  | `AUTHORISED_OFFICER_GROUP`                                                         |
| `hasReadOnlyPermissions` | `AUTHORISED_READONLY_GROUP`                                                        |

Staff with none of these groups are treated as authenticated-but-unauthorised and are redirected to `/access-denied`. Unauthenticated staff-page requests go to `/login`. Resident cookies are not staff sessions, and staff cookies are not resident sessions.

## Page access

`authorizeStaffPage` (`lib/auth/page.ts`) is the SSR gate. `{ write: true }` blocks read-only-only users. `{ requiredGroup }` checks the **raw group list**, not the derived flags.

| Page                                           | Read-only                                                 | Officer                                | Admin                                                      | Manager                                                    |
| ---------------------------------------------- | --------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `/applications` (worktray + search)            | Yes (worktray and sidebar hidden)                         | Yes                                    | Yes                                                        | Yes                                                        |
| `/applications/search-results`                 | Yes (sidebar hidden)                                      | Yes                                    | Yes                                                        | Yes                                                        |
| `/applications/view/[id]`                      | Yes, unless the case is sensitive and they cannot view it | Yes, with the same sensitive-data rule | Yes                                                        | Yes                                                        |
| `/applications/view/[id]/[person]`             | Same as view                                              | Same as view                           | Same as view                                               | Same as view                                               |
| `/applications/unassigned`                     | No (`write: true`)                                        | Yes                                    | Yes                                                        | Yes                                                        |
| `/applications/view-register`                  | No (`write: true`)                                        | Yes                                    | Yes                                                        | Yes                                                        |
| `/applications/add-case`                       | No (`write: true`)                                        | Yes                                    | Yes                                                        | Yes                                                        |
| Edit person / household / add household member | No (`write: true`)                                        | Yes                                    | Yes                                                        | Yes                                                        |
| `/applications/reports`                        | No                                                        | No                                     | **No**, unless they are also in `AUTHORISED_MANAGER_GROUP` | Yes, only if `AUTHORISED_MANAGER_GROUP` is in their claims |
| `/applications/throw-error`                    | Page loads but UI is empty                                | Same                                   | Yes (Sentry test buttons)                                  | Same as officer                                            |

Worktray, group worktray, all-applications, and reports links in the sidebar are not role-filtered. Read-only users simply do not see that sidebar. Officer and admin still see Reports and will be denied if they open it.

## Viewing a case (overview UI)

On `/applications/view/[id]`, sensitive cases with an assignee are hidden behind an in-page “Access denied” when `canViewSensitiveApplication` is false.

| Action / control                                               | Read-only                             | Officer                                                    | Admin | Manager |
| -------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------- | ----- | ------- |
| View a non-sensitive case                                      | Yes                                   | Yes                                                        | Yes   | Yes     |
| View a sensitive case assigned to someone else (or unassigned) | No                                    | No                                                         | Yes   | Yes     |
| View a sensitive case assigned to their own email              | No                                    | Yes                                                        | Yes   | Yes     |
| Assessment tab (non-draft statuses)                            | Hidden                                | Shown                                                      | Shown | Shown   |
| Change status / date controls                                  | Hidden                                | Shown (not gated by edit rights)                           | Shown | Shown   |
| Add household member button                                    | Hidden                                | Shown (not gated by edit rights)                           | Shown | Shown   |
| Edit applicant / household member links                        | Only if `canEditApplications` is true | Same                                                       | Same  | Same    |
| Assign / unassign / assign to me                               | Hidden                                | Shown                                                      | Shown | Shown   |
| Mark as sensitive / not sensitive                              | Hidden                                | Component may render; **button only for admin or manager** | Yes   | Yes     |
| Notes and history: add-note UI                                 | Hidden (`showDetails` false)          | Shown                                                      | Shown | Shown   |

`canEditApplications` (`lib/auth/staff.ts`):

1. No authorised role → cannot edit.
2. **Manager → can edit any status.**
3. Any authorised role, including read-only, → can edit `ManualDraft` _(read-only is still blocked on the API and on write pages)_.
4. Officer or admin → can edit `Submitted` or `AwaitingReassessment` **only when `assignedTo` equals their email**.
5. Otherwise → cannot edit (so admin **cannot** edit `Active` / `Pending` / etc. unless they also have the manager group).

That is why an officer can open an unassigned submitted case and see it, but applicant edit links stay hidden. Assessment, add household, assign, and change status stay available. Those actions succeed at this BFF for any writable staff — the same as before Cognito. Do not re-apply `canEditApplications` on write APIs in an attempt to “match the UI”: the view page itself uses two different rules, and tightening the API broke assign-to-me / status changes for officers.

## API mutations (this app)

Staff identity is the NextAuth session. Downstream Housing Register / Activity History calls forward the Cognito ID token when it is a real session.

### Create case — `POST /api/applications`

Requires any authorised staff role, then rejects read-only-only. Officer, admin, and manager can create a case.

`GET /api/applications` is **resident-only** (housing_user cookie). Staff get 401.

### Update case, notes, complete, evidence

`PATCH /api/applications/[id]`, `POST /api/applications/[id]/note`, `PATCH /api/applications/[id]/complete`, and `POST /api/applications/[id]/evidence` all use `getApplicationAccess` (`lib/utils/requestAuth.ts`). This matches the pre-Cognito BFF: it does **not** re-apply `canEditApplications` or sensitive-view rules.

1. Unauthenticated → 401.
2. Read-only-only, or no authorised role → 403.
3. Officer, admin, or manager → allowed for any application id, then forwarded to the Housing Register API.

| Scenario                                                                   | Read-only | Officer | Admin | Manager |
| -------------------------------------------------------------------------- | --------- | ------- | ----- | ------- |
| Create case                                                                | 403       | Yes     | Yes   | Yes     |
| Mutate any application (including unassigned / someone else’s / sensitive) | 403       | Yes     | Yes   | Yes     |

A resident may mutate **only** the application id in their own cookie; that path does not use staff roles.

### Reports APIs

`/api/reports/novalet/generate`, download, approve, and `/api/reports/internal/download` require membership of `AUTHORISED_MANAGER_GROUP` via `requireApiStaffGroup`. Officer, admin-only, and read-only get 403. `hasManagerPermissions` from the E2E group is **not** enough.

### Other

- `POST /api/notify/[template]` is resident-only.
- `/api/address/[postcode]` has no staff/resident check in this app.
- `/api/applications/throw-error` has no auth check (Sentry probe).

## Staff vs resident

|                                                | Staff session           | Resident session                                                                         |
| ---------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| Staff pages (`/applications…`)                 | Role rules above        | Redirect to login                                                                        |
| Resident apply pages / `GET /api/applications` | 401 on the resident API | Own application only                                                                     |
| Staff write APIs                               | Role rules above        | 401 unless the application id matches the resident cookie (PATCH/note/complete/evidence) |

## Quirks worth knowing

- **Admin ≠ manager** on the view page only. Admin can see others’ sensitive cases and can mark sensitivity; applicant edit links still follow `canEditApplications` (admin does not get manager’s “edit any status” rule). The BFF still lets admin PATCH like other writable staff.
- **Reports use the manager group string**, not `hasManagerPermissions`.
- **`canEditApplications` is a UI helper** (edit applicant / household member links). Writable staff mutations are not limited by it at this BFF layer.
- **`canEditApplications` returns true for read-only on `ManualDraft`**, but write pages and `getApplicationAccess` still deny read-only.
- This file is the **front-end / BFF** model. The Housing Register API may apply further checks on the forwarded Cognito token.
