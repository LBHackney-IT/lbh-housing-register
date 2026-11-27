import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

// HTTP-level spec for /api/applications/[id]/evidence. Evidence requests are a
// resident action, so these cover who may call it and what the server forwards
// to the Housing Register API, which is a different question from whether the
// declaration page works (see declaration.cy.ts).

const housingApi = Cypress.expose('HOUSING_REGISTER_API') as string;

const applicationId = faker.string.uuid();
const otherApplicationId = faker.string.uuid();
const evidencePath = `/applications/${applicationId}/evidence`;

const evidenceRequest = (body: unknown) => ({
  method: 'POST' as const,
  url: `/api/applications/${applicationId}/evidence`,
  // The route parses the raw body itself, so it has to be sent as a string.
  body: JSON.stringify(body),
  failOnStatusCode: false,
});

const expectNothingSentToHousingApi = () =>
  cy
    .getE2eCapturedRequests(housingApi, 'POST', evidencePath)
    .should('have.length', 0);

describe('/api/applications/[id]/evidence authorisation', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
    cy.mockHousingRegisterApiPostEvidenceRequest(applicationId);
  });

  it('rejects a request with no session', () => {
    cy.request(evidenceRequest({ documentTypes: ['proof-of-id'] })).then(
      (res) => {
        expect(res.status).to.eq(StatusCodes.UNAUTHORIZED);
      },
    );

    expectNothingSentToHousingApi();
  });

  it('does not accept a staff session as a resident', () => {
    cy.loginAsUser('manager');

    cy.request(evidenceRequest({ documentTypes: ['proof-of-id'] })).then(
      (res) => {
        expect(res.status).to.eq(StatusCodes.UNAUTHORIZED);
      },
    );

    expectNothingSentToHousingApi();
  });

  it("rejects a resident asking for evidence on someone else's application", () => {
    cy.loginAsResident(otherApplicationId, true);

    cy.request(evidenceRequest({ documentTypes: ['proof-of-id'] })).then(
      (res) => {
        expect(res.status).to.eq(StatusCodes.FORBIDDEN);
      },
    );

    expectNothingSentToHousingApi();
  });

  it('rejects document types it does not recognise', () => {
    cy.loginAsResident(applicationId, true);

    cy.request(evidenceRequest({ documentTypes: ['passport-scan'] })).then(
      (res) => {
        expect(res.status).to.eq(StatusCodes.BAD_REQUEST);
      },
    );
    cy.request(evidenceRequest({ documentTypes: [] })).then((res) => {
      expect(res.status).to.eq(StatusCodes.BAD_REQUEST);
    });

    expectNothingSentToHousingApi();
  });

  it('forwards only the document types, with the resident token that proves who asked', () => {
    cy.loginAsResident(applicationId, true);

    cy.request(
      evidenceRequest({
        documentTypes: ['proof-of-id', 'proof-of-address'],
        userRequestedBy: 'someone.else@hackney.gov.uk',
        applicationId: otherApplicationId,
      }),
    ).then((res) => {
      expect(res.status).to.eq(StatusCodes.OK);
    });

    cy.getCookie('housing_user').then((cookie) => {
      cy.getE2eCapturedRequests(housingApi, 'POST', evidencePath).then(
        (requests) => {
          expect(requests).to.have.length(1);
          const [{ body, headers }] = requests as {
            body: unknown;
            headers: Record<string, string>;
          }[];

          expect(body).to.deep.eq({
            documentTypes: ['proof-of-id', 'proof-of-address'],
          });
          expect(headers['x-resident-token']).to.eq(cookie?.value);
        },
      );
    });
  });
});
