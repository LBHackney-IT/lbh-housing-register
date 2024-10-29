import { faker } from '@faker-js/faker/locale/en_GB';
import { mount } from 'cypress/react';

import { Application } from '../../domain/HousingApi';
import { HackneyGoogleUserWithPermissions } from '../../lib/utils/googleAuth';
import { StatusCodes } from 'http-status-codes';
import { ActivityHistoryResponse } from '../../domain/ActivityHistoryApi';

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

const secret = 'aDummySecret';

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
  (targetId: string, results?: ActivityHistoryResponse, persist?: boolean) => {
    cy.task('nock', {
      hostname: Cypress.env('ACTIVITY_HISTORY_API'),
      method: 'GET',
      path: `/activityhistory?targetId=${targetId}&pageSize=100`,
      status: 200,
      body: { results: [results], paginationDetails: { nextToken: null } },
      persist,
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
  (
    applicationId: string,
    application: Application,
    persist: boolean,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'GET',
      path: `/applications/${applicationId}`,
      statusCode,
      body: application,
      persist,
      delay,
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiPatchApplication',
  (
    applicationId: string,
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
    persist?: boolean
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}`,
      statusCode,
      body,
      persist,
      delay,
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiCompleteApplication',
  (
    applicationId: string,
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}/complete`,
      statusCode,
      body,
      delay,
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostApplication',
  (
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/applications`,
      statusCode,
      body,
      delay,
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

  cy.task('generateToken', { user, secret }).then((token) => {
    const cookieName = 'hackneyToken';
    cy.getCookies().should('be.empty');
    cy.setCookie(cookieName, token as string);
    cy.getCookie(cookieName).should('have.property', 'value', token);
    cy.wrap(user).as('currentUser');
  });
});

Cypress.Commands.add(
  'loginAsResident',
  (
    applicationId: string,
    setSeenCookieMessage?: boolean,
    seenCookieMessageAlreadySet?: boolean
  ) => {
    const user = {
      application_id: applicationId,
    };

    cy.task('generateToken', { user, secret }).then((token) => {
      const authCookieName = 'housing_user';
      const cookieMessageCookieName = 'seen_cookie_message';

      if (!seenCookieMessageAlreadySet) {
        cy.getCookies().should('be.empty');
      }

      cy.setCookie(authCookieName, token as string);
      cy.getCookie(authCookieName).should('have.property', 'value', token);

      if (setSeenCookieMessage) {
        cy.setCookie(cookieMessageCookieName, 'true');
        cy.getCookie(cookieMessageCookieName).should(
          'have.a.property',
          'value',
          'true'
        );
      }

      cy.wrap(user).as('currentUser');
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostGenerateToken',
  (
    delay: number = 0,
    persist: boolean = false,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/auth/generate`,
      statusCode,
      body: {
        success: true,
      },
      delay,
      persist,
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostVerifyToken',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    const user = {
      application_id: applicationId,
    };

    cy.task('generateToken', { user, secret }).then((token) => {
      cy.task('nock', {
        hostname: Cypress.env('HOUSING_REGISTER_API'),
        method: 'POST',
        path: `/auth/verify`,
        statusCode,
        body: {
          accessToken: token,
        },
        delay,
      });
    });
  }
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostEvidenceRequest',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/applications/${applicationId}/evidence`,
      statusCode,
      delay,
    });
  }
);
Cypress.Commands.add(
  'mockHousingRegisterApiPatchCompleteApplication',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK
  ) => {
    cy.task('nock', {
      hostname: Cypress.env('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}/complete`,
      statusCode,
      delay,
    });
  }
);
Cypress.Commands.add(
  'mockNotifyEmailResponse',
  (statusCode: number = StatusCodes.OK) => {
    console.log('status code:', statusCode);
    cy.task('nock', {
      hostname: 'https://api.notifications.service.gov.uk',
      method: 'POST',
      path: '/v2/notifications/email',
      statusCode,
      body: statusCode == StatusCodes.OK ? 'email sent' : 'email failed',
      persist: true,
    });
  }
);

Cypress.Commands.add('mockAddressAPISearchByPostcode', (postcode: string) => {
  cy.task('nock', {
    hostname: Cypress.env('LOOKUP_API_URL'),
    method: 'GET',
    path: `/?postcode=${postcode}`,
    body: {
      data: {
        address: [
          {
            line1: 'Address Line 1',
            line2: 'Address Line 2',
            line3: 'Address Line 3',
            line4: 'Address Line 4',
            town: 'Test Town',
            postcode,
            UPRN: 12345678901,
          },
        ],
        page_count: 1,
        total_count: 1,
      },
    },
  });
});
