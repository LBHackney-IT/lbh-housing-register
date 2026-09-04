[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=alert_status&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=bugs&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=code_smells&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=coverage&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=reliability_rating&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=security_rating&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=sqale_rating&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LBHackney-IT_lbh-housing-register&metric=vulnerabilities&token=53ad71666e57ac13dd684c805e51159681565765)](https://sonarcloud.io/summary/new_code?id=LBHackney-IT_lbh-housing-register)

# Hackney: Housing register.

**A new tool for Hackney residents to check if they qualify to be on the housing register, and if certain criteria is met, they may continue through the process to submit a housing application form.**

## 🧐 What does it do?

This application has two sides: the _officer dashboard_ side, for council officers to log in and manage applications, and the _resident_ side for residents to submit applications for approval.

### Resident Flow

This app will form part of the user journey, allowing for an application to the housing register. This breaks down into the following steps.

- **`/`** - Entry point, provide starting information and signposts the user to the housing registration application
- **`/apply/sign-in`** - Sign in using an email address
- **`/apply/verify`** - Verify the email address with a code

If the resident is signing up for the first time, then they will be shown the following steps before they get to the application overview.

- **`/apply/start`** - Provide initial details for the application
- **`/apply/household`** - Provide the household members included in the application
- **`/apply/expect`** - Provide the expected bedroom need based on the household members

Once signed in, the resident will then be able to update their application.

- **`/apply/overview`** - Overall view of the application, display a list of people and current progress
- **`/apply/[person]`** - Overall view of each person involved with the application
  - **`/apply/[person]/[step]`** - Step of the application form

If at any point during the application process, details are provided that would disqualify the application, the resident is taken to the `/apply/not-eligible` page.

After all the questions have been answered and the application details are complete, the resident will be shown the outcome.

- **`/apply/submit/additional-questions`** - Further questions relating to their application
- **`/apply/submit/declaration`** - Final declaration to agree to the terms of the application
- **`/apply/confirmation`** - Confirmation that the application has been submitted

### Staff Dashboard

- **`/login`** - Login to the staff dashboard
- **`/access-denied`** - Active user logged in, but without access to required page
- **`/applications`** - The homepage for officers, which displays applications assigned to them
  - **`/applications/unassigned`** - View any unassigned applications, which can be assigned to an officer
  - **`/applications/view/:id`** - View all information relating to a particular application
  - **`/applications/reports`** - Download reports to export application data

## 🧱 How it's made

This app has been built using [Next.js](https://nextjs.org), with components built out using the [Hackney design system](https://design-system.hackney.gov.uk/developing/react) as reference.

Forms are using [Formik](https://formik.org/), a React library to make building forms easier.

### Components

The components are taken from the [design system](https://design-system.hackney.gov.uk), with only the relevant mark-up being copied into the react components. You may find for this reason that not all variants of each component exists within this app, this is because not everything is entirely relevant to the housing register; we should add only those components and the required variants as and when they are needed to reduce down maintenance of this tool.

Unlike the mark-up, the styling and javascript are available as a package and easily imported from the [lbh-frontend](https://github.com/LBHackney-IT/LBH-frontend) library (using `npm`). We should continue to support this approach, for example:

```scss
@import 'node_modules/lbh-frontend/lbh/base';
@import 'node_modules/lbh-frontend/lbh/components/lbh-button/button';
```

_Imports the button styling from the lbh-frontend library_

### TypeScript

The React components are built using the [TypeScript](https://www.typescriptlang.org) template, and we should follow the functional approach for consistency.

> TypeScript provides a way to describe the shape of a javascript object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.

## 💻 Getting started

As a prerequisite to run this app you will need to install [Node.js](https://nodejs.org/en/download)(version 24 is currently used in local development and in the pipeline) and [npm](https://docs.npmjs.com/cli/v10/commands/npm-install):

If you have Node Version manager you can set node to the correct version using the nvm command.

```
nvm use
```

### Running locally

Copy the .env sample to the root of your application and get the variables from AWS params store or the password manager.

Cognito only permits HTTP callback URLs on `localhost`. Set
`NEXTAUTH_URL=http://localhost:3000` in `.env`, and add the matching callback
and logout URLs on the Cognito app client (see
[Cognito staff authentication](docs/cognito-staff-auth.md)). When you next
launch the app, it should be on `http://localhost:3000`.

If you have the right configuration setup within the `.env` file, you should be able to access the staff dashboard.

```
npm install
npm run dev
```

To run the backend, please refer to [Housing Register Local Backend](https://github.com/LBHackney-IT/housing-register-local-backend). This repository is designed to help development and testing of Housing Register application by removing the dependencies to AWS environment.

### Logging in

The staff dashboard uses an AWS Cognito confidential app client. Google
Workspace authentication is federated through Cognito, and permissions are
mapped from the trusted `custom:groups` claim added by the Cognito
pre-token-generation Lambda. See
[Cognito staff authentication](docs/cognito-staff-auth.md) for the required
AWS, Google, environment, session, and logout configuration.

You need a **@hackney.gov.uk** Google account to sign in. Speak to Hackney IT if you don't have this.

#### Permissions

We have defined Google Groups in relation to access permissions and roles for what is possible within the staff dashboard.

These are as follows:

- AUTHORISED_ADMIN_GROUP: can do any required action
- AUTHORISED_MANAGER_GROUP: same as officers, plus can assign applications to officers for assessment and see sensitive data
- AUTHORISED_OFFICER_GROUP: can view applications and perform assessments on assigned applications
- AUTHORISED_READONLY_GROUP: can view applications

The scope and expectations around permissions have been kept fairly limited at this stage, but is an area for future enhancements.

### Pre-commit hooks

Repository has a husky configuration to prevent commits that fail linting or tests. The hooks run as follows:

- **pre-commit:** runs `lint-staged` (linting and formatting on staged files), the Jest test suite, Cypress component tests, and a [ggshield](https://docs.gitguardian.com/ggshield-docs/getting-started) secret scan.
- **commit-msg:** runs `commitlint` to enforce conventional commit format (see below).

### Conventional commits

Repository enforces [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) using [Commitlint](https://commitlint.js.org/) for validation.

### E2E tests

End-to-end tests use Cypress. Set env vars for **AUTHORISED\_\*** groups (and the rest of `.env`) before running; see `.env.sample`.

**How it works**

- Run Next with `npm run dev` or use `npm run build` / `npm run start` if you prefer a production build.
- **Standard** specs live under `cypress/e2e/` (excluding `local/`). They rely on **server-side HTTP mocks**: Cypress registers mocks via `/api/e2e/nock`, and the Next server must run with **`E2E_HTTP_MOCKS=true`** so those routes and in-process nock are enabled. CI sets this in CircleCI; locally add it to `.env` or export it when starting Next. Staff sessions are created by a Cypress Node task and deliberately contain no Cognito ID token, so no fake bearer token is sent to the mocked APIs.
- **`npm run cypress:open`** / **`npm run e2e:run`** set `E2E_HTTP_MOCKS=true` for the Cypress process; your Next process still needs the same flag if tests register mocks.

**Local e2e** (`cypress/e2e/local/`)

- Set **`LOCAL_E2E=true`** so Cypress includes the `local` folder (see `cypress.config.ts` `excludeSpecPattern`). Use **`npm run cypress:open:local`** or **`npm run e2e:run:local`**.
- Configure `COGNITO_E2E_CLIENT_ID`, `COGNITO_E2E_USERNAME`, and
  `COGNITO_E2E_PASSWORD` for a dedicated native E2E app client/user. That client
  must be public (no client secret), allow `USER_PASSWORD_AUTH`, and use the pool
  in `COGNITO_ISSUER`. Cognito login runs in Cypress's Node process, so
  credentials are never exposed to browser code.
- Map that user's test group to manager with
  **`E2E_AUTHORISED_MANAGER_GROUP`**, for example
  `E2E_AUTHORISED_MANAGER_GROUP=e2e-testing-production-t-and-l`. It is additive
  to `AUTHORISED_MANAGER_GROUP`, so you can keep the real group name in `.env`
  and still sign in with your own claims. It applies only while
  `LOCAL_E2E=true` outside a deployment, and `serverless.yml` never passes it,
  so it cannot affect a deployed build. `managerActions.cy.ts` is the only spec
  that needs it.
- Run a [local backend](https://github.com/LBHackney-IT/housing-register-local-backend) (Housing Register API, DynamoDB, LocalStack, etc.) and point `.env` at it (`HOUSING_REGISTER_API`). This will also need a modification as detailed in the README.md to avoid hitting GovUK Notify.
- Do not set `E2E_HTTP_MOCKS` for local-backend tests. Their staff journey sends
  the real Cognito ID token to the real API.
- Local flows hit the real API for almost everything. For declaration submit, **`POST /api/applications/:id/evidence`** is **stubbed in the browser** (`cypress/support/e2e.ts` when running with `LOCAL_E2E=true`) so you do not need a real Evidence API or server-side nock for that call.

Failed runs record video (see `cypress.config.ts`).

## 🚀 Deployment

Pushes to the `development` branch are automatically built and deployed to the development environment.

### CI pipeline

CircleCI (`.circleci/config.yml`) splits checks into **PR gates** and **post-merge integration gates**:

- **PRs** (any branch): `build`, `run-tests` (Jest + Cypress component tests), and `sonar-scan`.
- **After merge to `development` or `main`**, and on **release tags** (`hackney-housing-register-v*`): the full Cypress E2E matrix (`run-cypress-e2e`) runs before deploy. Deploy jobs require E2E to pass, but E2E is not a PR merge requirement.

### Release Please

Automation uses **[`.github/workflows/release-please.yml`](.github/workflows/release-please.yml)** ([`googleapis/release-please-action`](https://github.com/googleapis/release-please-action)). Config lives in [`release-please-config.json`](release-please-config.json) and [`.release-please-manifest.json`](.release-please-manifest.json).

Pushes to `main` run the workflow, which opens or updates a release PR. Merging that PR creates a version tag; CircleCI then runs the following gated deployment pipeline (see `.circleci/config.yml` tag filters):

1. **Unit and component tests** (`run-tests`) run against the tagged commit.
2. **Build** (`build`) produces the Next.js standalone Lambda artifact.
3. **Staging deploy** — the artifact is deployed to the staging environment automatically.
4. **Manual approval gate** — a `permit-deploy-production` step in CircleCI must be approved by a team member before production is touched.
5. **Production deploy** — runs only after approval.

For Release Please’s changelog, **what matters is conventional commit messages on `main`**. Conventional commits are enforced as described above.

## Concepts

### APIs

We've defined a couple of gateways to interact with our API. These are set up as follows:
ms

- **`internal-api.ts`**
  - This acts as a means of routing client side requests, for example form submissions, to a proxy endpoint on the Next.js server.
  - Requests are sent via [API routes](https://nextjs.org/docs/api-routes/introduction) which run server side

- **`applications-api.ts`**
  - This acts as a means of sending server side requests to the Housing Register API.
  - This is currently used within the staff portal and we are using `getServerSideProps` to preload the data

### Forms

As mentioned above we are using [Formik](https://formik.org/) to help create and handle forms.

This has been extended to be used in a more generic way, which means forms can be created from JSON files. These are stored within `data/forms`. To add a new form, create a JSON file with the necessary configuration for the fields required and then reference it within the helper function `getFormData`. Example below...

```
{
  "heading": "Accommodation details",
  "steps": [
    {
      "fields": [
        {
          "label": "Postcode",
          "name": "postcode",
          "validation": {
            "required": true
          }
        },
        ...
      ]
    }
  ]
}
```

### Higher order components

[Higher order components](https://reactjs.org/docs/higher-order-components.html) are used to wrap existing components with some logic about the current application, allowing for code re-use.

- `withApplication` - ensure there is an active application and user, or redirect

### Emails

[Gov.UK Notify](https://gov.uk/notify) is used to send emails (e.g. confirmation emails). Update the `NOTIFY_API_KEY` and relevant template ids in the `.env` file.

- NOTIFY_TEMPLATE_NEW_APPLICATION: sent on completion of an application
- NOTIFY_TEMPLATE_DISQUALIFY: sent on disqualification on an application
- NOTIFY_TEMPLATE_MEDICAL_NEED: sent if anyone in the application states a medical need
