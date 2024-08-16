import { faker } from '@faker-js/faker/locale/en_GB';
import { mount } from 'cypress/react';
// import 'dotenv/config';

// type Environment = 'localdev' | 'development';

// const environment: Environment =
//   (process.env.NEXT_PUBLIC_ENV as Environment) || 'development';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('mount', mount);

Cypress.Commands.add('generateEmptyApplication', () => {
  cy.writeFile('cypress/fixtures/application.json', {
    id: faker.string.uuid(),
    reference: faker.string.alphanumeric(10),
    status: 'New',
    sensitiveData: false,
    assignedTo: 'unassigned',
    createdAt: faker.date.recent().toISOString(),
    submittedAt: null,
    mainApplicant: {
      person: null,
      address: null,
      contactInformation: {
        email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
        phoneNumber: null,
        preferredMethodOfContact: null,
      },
      questions: null,
      requiresMedical: false,
      medicalNeed: null,
    },
    calculatedBedroomNeed: null,
    otherMembers: [],
    assessment: null,
    importedFromLegacyDatabase: false,
  });
});

Cypress.Commands.add('loginAsUser', (userType: string) => {
  // if it's running against the local env then should be set from the env vaars, otherwise match the congg.
  const users = {
    officer: {
      email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
      name: faker.person.fullName(),
      groups: Cypress.env('AUTHORISED_OFFICER_GROUP'),
      // groups:
      //   Cypress.env('NEXT_PUBLIC_ENV') === 'localdev'
      //     ? [Cypress.env('AUTHORISED_OFFICER_GROUP')]
      //     : ['WHATEVA'],
    },
    manager: {
      email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
      name: faker.person.fullName(),
      groups: Cypress.env('AUTHORISED_MANAGER_GROUP'),
      // Cypress.env('NEXT_PUBLIC_ENV') === 'localdev'
      //   ? [Cypress.env('AUTHORISED_MANAGER_GROUP')]
      //   : ['WHATEVA'],
    },
    admin: {
      email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
      name: faker.person.fullName(),
      groups: Cypress.env('AUTHORISED_ADMIN_GROUP'),
      // groups:
      //   Cypress.env('NEXT_PUBLIC_ENV') === 'localdev'
      //     ? [Cypress.env('AUTHORISED_ADMIN_GROUP')]
      //     : ['WHATEVA'],
    },
    readOnly: {
      email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
      name: faker.person.fullName(),
      groups: Cypress.env('AUTHORISED_READONLY_GROUP'),
      // groups:
      //   Cypress.env('NEXT_PUBLIC_ENV') === 'localdev'
      //     ? [Cypress.env('AUTHORISED_READONLY_GROUP')]
      //     : ['WHATEVA'],
    },
  };

  const user = users[userType];
  if (!user) {
    throw new Error(`No user data found for user type "${userType}"`);
  }
  const secret = 'aDummySecret';

  cy.task('generateToken', { user, secret }).then((token) => {
    const cookieName = 'hackneyToken';
    cy.getCookies().should('be.empty');
    cy.setCookie(cookieName, token as string);
    cy.getCookie(cookieName).should('have.property', 'value', token);
  });
});
