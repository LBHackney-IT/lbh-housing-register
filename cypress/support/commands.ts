import { faker } from '@faker-js/faker/locale/en_GB';
import { mount } from 'cypress/react';

import { Application } from '../../domain/HousingApi';
import { StaffUserWithPermissions } from '../../lib/auth/staff';
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

/** Public values from `cypress.config.ts` `expose` (avoids deprecated `Cypress.env`). */
function exposed(key: string): string {
  const value = Cypress.expose(key);
  if (value == null || value === '') {
    throw new Error(
      `Missing Cypress expose "${key}". Set it in cypress.config.ts and your .env.`,
    );
  }
  return String(value);
}

/** Registers Nock in the Next.js server process (requires E2E_HTTP_MOCKS=true on the app). */
function e2eRegisterNock(payload: Record<string, unknown>) {
  return cy.request({
    method: 'POST',
    url: '/api/e2e/nock',
    body: payload,
    failOnStatusCode: true,
  });
}

Cypress.Commands.add('clearE2eNock', () => {
  return cy
    .request({
      method: 'POST',
      url: '/api/e2e/clear-nock',
      failOnStatusCode: true,
    })
    .then(() => undefined);
});

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
    e2eRegisterNock({
      hostname: exposed('ACTIVITY_HISTORY_API'),
      method: 'GET',
      path: `/activityhistory?targetId=${targetId}&pageSize=100`,
      status: 200,
      body: { results: [results], paginationDetails: { nextToken: null } },
      persist,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo',
  (user: StaffUserWithPermissions) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'GET',
      path: `/applications/ListApplicationsByAssignedTo?status=Submitted&assignedTo=${user.email}&Page=1&PageSize=10`,
      persist: true,
      status: 200,
      body: { user, results: [], totalResults: 0, page: 1, pageSize: 10 },
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiGetApplications',
  (
    applicationId: string,
    application: Application,
    persist: boolean,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'GET',
      path: `/applications/${applicationId}`,
      statusCode,
      body: application,
      persist,
      delay,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPatchApplication',
  (
    applicationId: string,
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
    persist?: boolean,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}`,
      statusCode,
      body,
      persist,
      delay,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiCompleteApplication',
  (
    applicationId: string,
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}/complete`,
      statusCode,
      body,
      delay,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostApplication',
  (
    body?: Application,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/applications`,
      statusCode,
      body,
      delay,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostSearchResults',
  (application: Application) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
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
  },
);

const issuedAtInMilliseconds = new Date().getMilliseconds();

const generateUser = (groupEnv: string) => ({
  email: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
  name: faker.person.fullName(),
  groups: [exposed(groupEnv)],
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
    noGroup: {
      ...generateUser('AUTHORISED_OFFICER_GROUP'),
      groups: [],
    },
  };

  const user = users[userType as keyof typeof users];

  if (!user) {
    throw new Error(`No user data found for user type "${userType}"`);
  }

  const isLocalE2e = Cypress.expose('LOCAL_E2E') === 'true';
  if (isLocalE2e && userType !== 'manager') {
    throw new Error(
      'LOCAL_E2E Cognito sign-in only supports the manager role. ' +
        "Set E2E_AUTHORISED_MANAGER_GROUP to the dedicated user's test group.",
    );
  }

  const session = isLocalE2e
    ? cy.task('createCognitoStaffSession', null, { log: false })
    : cy.task('createMockStaffSession', user, { log: false });

  session.then((result) => {
    const { cookies, user: authenticatedUser } = result as {
      cookies: Array<{ name: string; value: string }>;
      user: typeof user;
    };
    if (userType !== 'noGroup') {
      const groupVariable = isLocalE2e
        ? 'E2E_AUTHORISED_MANAGER_GROUP'
        : `AUTHORISED_${userType.toUpperCase()}_GROUP`;
      const expectedGroup = exposed(groupVariable);
      if (!authenticatedUser.groups.includes(expectedGroup)) {
        throw new Error(
          `Signed-in staff groups do not include "${expectedGroup}" from ${groupVariable}. ` +
            `Groups present: ${authenticatedUser.groups.join(', ') || '(none)'}`,
        );
      }
    }

    cy.getCookies().should('be.empty');
    cookies.forEach(({ name, value }) => {
      cy.setCookie(name, value);
      cy.getCookie(name).should('have.property', 'value', value);
    });
    cy.wrap(authenticatedUser).as('currentUser');
  });
});

/**
 * Yields the application the resident session is actually signed in to, which
 * the real verify step replaces with the one the backend created.
 */
Cypress.Commands.add('residentApplicationId', () =>
  cy.getCookie('housing_user').then((residentCookie) => {
    if (!residentCookie?.value) {
      throw new Error('Resident session cookie "housing_user" is not set');
    }
    return cy.task<string>('readResidentApplicationId', residentCookie.value, {
      log: false,
    });
  }),
);

Cypress.Commands.add(
  'loginAsResident',
  (
    applicationId: string,
    setSeenCookieMessage?: boolean,
    seenCookieMessageAlreadySet?: boolean,
  ) => {
    cy.task('createResidentSession', applicationId, { log: false }).then(
      (result) => {
        const {
          cookies: [authCookie],
          user,
        } = result as {
          cookies: Array<{ name: string; value: string }>;
          user: { application_id: string };
        };
        const cookieMessageCookieName = 'seen_cookie_message';

        if (!seenCookieMessageAlreadySet) {
          cy.getCookies().should('be.empty');
        }

        cy.setCookie(authCookie.name, authCookie.value);
        cy.getCookie(authCookie.name).should(
          'have.property',
          'value',
          authCookie.value,
        );

        if (setSeenCookieMessage) {
          cy.setCookie(cookieMessageCookieName, 'true');
          cy.getCookie(cookieMessageCookieName).should(
            'have.a.property',
            'value',
            'true',
          );
        }

        cy.wrap(user).as('currentUser');
      },
    );
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostGenerateToken',
  (
    delay: number = 0,
    persist: boolean = false,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/auth/generate`,
      statusCode,
      body: {
        success: true,
      },
      delay,
      persist,
    });
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostVerifyToken',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    cy.task('createResidentSession', applicationId, { log: false }).then(
      (result) => {
        const token = (result as { token: string }).token;
        e2eRegisterNock({
          hostname: exposed('HOUSING_REGISTER_API'),
          method: 'POST',
          path: `/auth/verify`,
          statusCode,
          body: {
            accessToken: token,
          },
          delay,
        });
      },
    );
  },
);

Cypress.Commands.add(
  'mockHousingRegisterApiPostEvidenceRequest',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'POST',
      path: `/applications/${applicationId}/evidence`,
      statusCode,
      delay,
    });
  },
);
Cypress.Commands.add(
  'mockHousingRegisterApiPatchCompleteApplication',
  (
    applicationId: string,
    delay: number = 0,
    statusCode: number = StatusCodes.OK,
  ) => {
    e2eRegisterNock({
      hostname: exposed('HOUSING_REGISTER_API'),
      method: 'PATCH',
      path: `/applications/${applicationId}/complete`,
      statusCode,
      delay,
    });
  },
);
Cypress.Commands.add(
  'mockNotifyEmailResponse',
  (statusCode: number = StatusCodes.OK) => {
    e2eRegisterNock({
      hostname: 'https://api.notifications.service.gov.uk',
      method: 'POST',
      path: '/v2/notifications/email',
      statusCode,
      body: statusCode == StatusCodes.OK ? 'email sent' : 'email failed',
      persist: true,
    });
  },
);

/**
 * Returns every request the Next.js server process has sent to a mocked
 * dependency (registered via one of the `mock*` commands above), most-recent
 * last. Useful for asserting on *what* was sent - e.g. that Notify received
 * the resident's real email/personalisation rather than anything supplied by
 * the caller - since the response status alone can't distinguish "sent the
 * real data" from "sent the attacker-supplied data" when both succeed.
 */
Cypress.Commands.add(
  'getE2eCapturedRequests',
  (hostname: string, method: string, path: string) => {
    return cy
      .request({
        method: 'POST',
        url: '/api/e2e/captured-requests',
        body: { hostname, method, path },
        failOnStatusCode: true,
      })
      .then((res) => (res.body as { requests: object[] }).requests);
  },
);

Cypress.Commands.add('mockAddressAPISearchByPostcode', (postcode: string) => {
  e2eRegisterNock({
    hostname: exposed('LOOKUP_API_URL'),
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
