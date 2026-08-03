import { faker } from '@faker-js/faker/locale/en_GB';
import { StatusCodes } from 'http-status-codes';

import { Application } from '../../../../../domain/HousingApi';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import { generatePerson } from '../../../../../testUtils/personHelper';

// This spec proves the authorisation fix on /api/notify/[template] holds at
// the HTTP level (real session cookie, real routing) rather than just in the
// mocked jest unit tests - specifically that:
//   1. a request with no resident session is rejected, and Notify is never
//      contacted, and
//   2. a request with a valid session sends the *server's* application
//      record to Notify, ignoring any client-supplied email/personalisation.
//
// Note: a 200 here only proves the request was authorised, the application
// was found, and Notify accepted the call - it doesn't on its own prove
// *what* was sent (an attacker-controlled body sent to Notify unchanged
// would also come back 200). These tests use `cy.getE2eCapturedRequests` to
// inspect the actual request body the server sent to Notify, and always
// register `cy.mockNotifyEmailResponse()` so a bug can never cause a real
// call to the live GOV.UK Notify API.

const notifyHostname = 'https://api.notifications.service.gov.uk';
const notifyPath = '/v2/notifications/email';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();

const realFirstName = 'RealApplicant';
const realEmail = faker.internet.email({ provider: 'hackneyTEST.gov.uk' });

const application: Application = (() => {
  const base = generateApplication(applicationId, personId, true, false);
  return {
    ...base,
    mainApplicant: {
      ...base.mainApplicant,
      person: { ...generatePerson(personId), firstName: realFirstName },
      contactInformation: { emailAddress: realEmail },
    },
  };
})();

const attackerSuppliedBody = {
  emailAddress: 'attacker@evil.example',
  reference: 'attacker-controlled-reference',
  personalisation: {
    resident_name: 'Attacker Controlled Name',
    reason: 'attacker controlled reason',
  },
};

describe('/api/notify/[template] authorisation', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
    // Always mocked, regardless of what each test asserts: guarantees a bug
    // in these tests (or the endpoint) can never result in a real call to
    // the live GOV.UK Notify API.
    cy.mockNotifyEmailResponse();
  });

  it('rejects a request with no resident session and never contacts Notify', () => {
    cy.request({
      method: 'POST',
      url: '/api/notify/disqualify',
      body: attackerSuppliedBody,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(StatusCodes.UNAUTHORIZED);
    });

    cy.getE2eCapturedRequests(notifyHostname, 'POST', notifyPath).then(
      (requests) => {
        expect(requests).to.have.length(0);
      },
    );
  });

  it("sends the caller's own application data to Notify, ignoring any client-supplied body", () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    cy.request({
      method: 'POST',
      url: '/api/notify/disqualify',
      body: attackerSuppliedBody,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(StatusCodes.OK);
    });

    cy.getE2eCapturedRequests(notifyHostname, 'POST', notifyPath).then(
      (requests) => {
        expect(requests).to.have.length(1);

        const [{ body }] = requests as {
          body: {
            email_address: string;
            personalisation: Record<string, string>;
          };
        }[];

        expect(body.email_address).to.eq(realEmail);
        expect(body.personalisation.resident_name).to.eq(realFirstName);

        expect(body.email_address).not.to.eq(attackerSuppliedBody.emailAddress);
        expect(body.personalisation.resident_name).not.to.eq(
          attackerSuppliedBody.personalisation.resident_name,
        );
      },
    );
  });
});
