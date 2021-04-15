# Hackney: Housing register

**A new tool for Hackney residents to check if they qualify to be on the housing register, and if certain criteria is met, they may continue through the process to submit a housing application form.**

This app will form part of the user journey, with an multi-step questionnaire which determines the users' eligibility before being able to continue and submit their application, this breaks down into the following steps:

- Article detailing advice and process which signposts the user to the housing registration app
- Qualifying quiz (`/apply`): Which checks at a basic level if the user and their immediate family are eligible for social housing within Hackney
- Registration form: *needs more detail around steps*
- Submit: Ability to submit the application via the housing registration API

## Development

This app has been built using [Next.js](https://nextjs.org), with components built out using the [Hackney design system](https://design-system.hackney.gov.uk/developing/react) as reference.

### Components

The components are taken from the [design system](https://design-system.hackney.gov.uk), with only the relevant mark-up being copied into the react components. You may find for this reason that not all variants of each component exists within this app, this is because not everything is entirely relevant to the housing register; we should add only those components and the required variants as and when they are needed to reduce down maintenance of this tool.

Unlike the mark-up, the styling and javascript are available as a package and easily imported from the [lbh-frontend](https://github.com/LBHackney-IT/LBH-frontend) library (using `npm`). We should continue to support this approach, for example:

```scss
@import "node_modules/lbh-frontend/lbh/base";
@import "node_modules/lbh-frontend/lbh/components/lbh-button/button";
```

*Imports the button styling from the lbh-frontend library*

### TypeScript

The React components are built using the [TypeScript](https://www.typescriptlang.org) template, and we should follow the functional approach for consistency.

> TypeScript provides a way to describe the shape of a javascript object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.

## Installation

As a prerequisite to run this app you will need to install [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/cli/v7/commands/npm-install):

```
npm install
npm run dev
```

The app will attempt to start on port `3000` and should be available on localhost: `localhost:3000`