import { faker } from '@faker-js/faker/locale/en_GB';
import { mount } from 'cypress/react';

import { Application } from '../../domain/HousingApi';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';

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
// ***********************************************

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

Cypress.Commands.add(
  'mockActivityHistoryApiEmptyResponse',
  (targetId: string) => {
    cy.task('nock', {
      hostname: Cypress.env('ACTIVITY_HISTORY_API'),
      method: 'GET',
      path: `/activityhistory?targetId=${targetId}&pageSize=100`,
      status: 200,
      body: {
        results: [{}],
        paginationDetails: { nextToken: null },
      },
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo',
  (user: HackneyGoogleUserWithPermissions) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'GET',
      path: `/applications/ListApplicationsByAssignedTo?status=Submitted&assignedTo=${user.email}&Page=1&PageSize=10`,
      persist: true,
      status: 200,
      body: { user, results: [], totalResults: 0, page: 1, pageSize: 10 },
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiGetApplications',
  (applicationId: string, application: Application) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'GET',
      path: `/applications/${applicationId}`,
      status: 200,
      body: application,
    });
  }
);
Cypress.Commands.add(
  'mockHousingRegisterApiPostSearchResults',
  (application: Application) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/applications/search`,
      statusCode: 200,
      body: {
        results: [
          {
            applicationId: application.id,
            assignedTo: application.assignedTo,
            biddingNumber: null,
            createdAt: application.createdAt,
            dateOfBirth: application.mainApplicant.person.dateOfBirth,
            firstName: application.mainApplicant.person.firstName,
            hasAssessment: application.assessment,
            middleName: application.mainApplicant.person.middleName,
            nationalInsuranceNumber:
              application.mainApplicant.person.nationalInsuranceNumber,
            otherMembers: application.otherMembers,
            reference: application.reference,
            sensativeData: application.sensitiveData,
            status: application.status,
            submittedAt: application.submittedAt,
            surname: application.mainApplicant.person.surname,
            title: application.mainApplicant.person.title,
          },
        ],
        totalResults: 1,
        page: 1,
        pageSize: 10,
      },
    });
  }
);

const issuedAtInMilliseconds = new Date().getMilliseconds();

const generateUser = (groupEnv: string) => ({
  email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
  name: faker.person.fullName(),
  groups: [Cypress.env(groupEnv)],
  sub: faker.number.int().toString(),
  iss: 'TestIssuer',
  iat: issuedAtInMilliseconds,
});

Cypress.Commands.add('loginAsUser', (userType: string) => {
  const users = {
    officer: generateUser('AUTHORISED_OFFICER_GROUP'),
    manager: generateUser('AUTHORISED_MANAGER_GROUP'),
    admin: generateUser('AUTHORISED_ADMIN_GROUP'),
    readOnly: generateUser('AUTHORISED_READONLY_GROUP'),
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
    cy.wrap(user).as('currentUser');
  });
});
