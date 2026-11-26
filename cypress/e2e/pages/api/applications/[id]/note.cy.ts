import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

// HTTP-level spec for /api/applications/[id]/note. Notes appear in the history
// as written by a named officer, so only staff who can write may add one. A
// resident, who owns the application but is not staff, must not.

const housingApi = Cypress.expose('HOUSING_REGISTER_API') as string;

const applicationId = faker.string.uuid();
const notePath = `/applications/${applicationId}/note`;

const noteRequest = {
  method: 'POST' as const,
  url: `/api/applications/${applicationId}/note`,
  // The route parses the raw body itself, so it has to be sent as a string.
  body: JSON.stringify({ Note: 'Called the applicant' }),
  failOnStatusCode: false,
};

const expectNothingSentToHousingApi = () =>
  cy
    .getE2eCapturedRequests(housingApi, 'POST', notePath)
    .should('have.length', 0);

describe('/api/applications/[id]/note authorisation', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
    cy.mockHousingRegisterApiPostNote(applicationId);
  });

  it('rejects a request with no session', () => {
    cy.request(noteRequest).then((res) => {
      expect(res.status).to.eq(StatusCodes.UNAUTHORIZED);
    });

    expectNothingSentToHousingApi();
  });

  it("rejects the application's own resident", () => {
    cy.loginAsResident(applicationId, true);

    cy.request(noteRequest).then((res) => {
      expect(res.status).to.eq(StatusCodes.FORBIDDEN);
    });

    expectNothingSentToHousingApi();
  });

  it('rejects read-only staff', () => {
    cy.loginAsUser('readOnly');

    cy.request(noteRequest).then((res) => {
      expect(res.status).to.eq(StatusCodes.FORBIDDEN);
    });

    expectNothingSentToHousingApi();
  });

  it('lets staff with write access add a note', () => {
    cy.loginAsUser('manager');

    cy.request(noteRequest).then((res) => {
      expect(res.status).to.eq(StatusCodes.OK);
    });

    cy.getE2eCapturedRequests(housingApi, 'POST', notePath).then((requests) => {
      expect(requests).to.have.length(1);
      expect((requests[0] as { body: unknown }).body).to.deep.eq({
        Note: 'Called the applicant',
      });
    });
  });
});
