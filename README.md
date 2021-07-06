# Hackney: Housing register

**A new tool for Hackney residents to check if they qualify to be on the housing register, and if certain criteria is met, they may continue through the process to submit a housing application form.**

## 🧐 What does it do?

This application has two sides: the _officer dashboard_ side, for council officers to log in and manage applications, and the _resident_ side for residents to submit applications.

### Resident Flow

This app will form part of the user journey, with an multi-step questionnaire which determines the users' eligibility before being able to continue and submit their application, this breaks down into the following steps:

- **`/`** - Entry point, provide starting information and signposts the user to the housing registration application
- **`/eligibility/[step]`** - Check eligibility status before applying
- **`/apply`** - Start a new application
  - **`/apply/sign-in`** - Return to an active application
  - **`/apply/overview`** - Overall view of the application, display a list of people and current progress
  - **`/apply/[person]`** - Overall view of each person involved with the application
    - **`/apply/[person]/[step]`** - Step of the application form

### Staff Dashboard

- **`/login`** - Login to the staff dashboard
- **`/access-denied`** - Active user logged in, but without access to required page
- **`/applications`** - The homepage for officers, which displays applications
  - **`/applications/:id`** - View all information relating to a particular application

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

As a prerequisite to run this app you will need to install [Node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/cli/v7/commands/npm-install):

### Running locally

```
npm install
npm run dev
```

The app will attempt to start on port `3000` and should be available on localhost: [http://localhost:3000](http://localhost:3000)

### Logging in

The staff dashboard is using [LBH Google Auth](https://github.com/LBHackney-IT/LBH-Google-auth) for authentication. Permissions to what a user is authorised to do, is managed by mapping Google groups.

You need a **@hackney.gov.uk** Google account to sign in. Speak to Hackney IT if you don't have this.

Next, you need to tell your computer to run the app from a hackney.gov.uk domain. Add this line to your hosts file (Windows: `C:\Windows\System32\drivers\etc\hosts`, Mac: `/etc/hosts`):

```
127.0.0.1   localdev.hackney.gov.uk
```

Update the `APP_URL` variable in the `.env` file to match. When you next launch the app, it should be on `http://localdev.hackney.gov.uk:3000`.

If you have the right configuration setup within the `.env` file, you should be able to access the staff dashboard.

### Mock Server

The app comes with a [mock server](http://mocks-server.org) for mock requests to external APIs. It runs automatically when you run the dev server, and is available on port 5000.

e.g. `http://localhost:5000/api/applications` will return a list of applications.

To connect directly to an external API, update the `ENDPOINT_API` variable in the `.env` file.

## Concepts

### APIs

We've defined a couple of gateways to interact with our API. These are set up as follows:

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
          "name": "postCode",
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

- `whenAgreed` - ensure that the applicant has agreed to the terms and conditions
