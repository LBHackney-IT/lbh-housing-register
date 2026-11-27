import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

import { generateEmailAddress } from '../../../testUtils/personHelper';
import { visitHomepageSignInAndVerify } from '../../support/locale2eTestsHelper';

// The mocked specs prove what the Next.js server sends and refuses. They can't
// prove the Housing Register API refuses on its own, which is what protects
// it if a request ever reaches it some other way. These calls skip the Next.js
// server and go straight to the real local API.

const housingApi = Cypress.expose('HOUSING_REGISTER_API') as string;
const apiUrl = (path: string) => new URL(path, housingApi).toString();

describe('Housing Register API authorisation', () => {
  const email = generateEmailAddress();
  let applicationId: string;
  let residentToken: string;

  before(() => {
    const placeholderId = faker.string.uuid();
    cy.clearAllCookies();
    cy.loginAsResident(placeholderId, false, false);
    visitHomepageSignInAndVerify(placeholderId, email);

    // Signing in for real replaces the placeholder session with the
    // application and token the backend created.
    cy.residentApplicationId().then((id) => {
      applicationId = id;
    });
    cy.getCookie('housing_user').then((cookie) => {
      residentToken = cookie!.value;
    });
  });

  it('refuses an evidence request that has no resident token', () => {
    cy.request({
      method: 'POST',
      url: apiUrl(`applications/${applicationId}/evidence`),
      body: { documentTypes: ['proof-of-id'] },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', StatusCodes.FORBIDDEN);
  });

  it('refuses a resident token that belongs to a different application', () => {
    cy.request({
      method: 'POST',
      url: apiUrl(`applications/${faker.string.uuid()}/evidence`),
      headers: { 'X-Resident-Token': residentToken },
      body: { documentTypes: ['proof-of-id'] },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', StatusCodes.FORBIDDEN);
  });

  it('accepts the resident token but not an evidence request before the application is submitted', () => {
    cy.request({
      method: 'POST',
      url: apiUrl(`applications/${applicationId}/evidence`),
      headers: { 'X-Resident-Token': residentToken },
      body: { documentTypes: ['proof-of-id'] },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', StatusCodes.CONFLICT);
  });

  it('refuses a note from anyone who is not staff, including the resident', () => {
    cy.request({
      method: 'POST',
      url: apiUrl(`applications/${applicationId}/note`),
      headers: { 'X-Resident-Token': residentToken },
      body: { note: 'Added by the resident' },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', StatusCodes.FORBIDDEN);
  });

  it('ignores a resident update that sets staff-owned fields or changes the sign-in email', () => {
    cy.request(apiUrl(`applications/${applicationId}`)).then(({ body }) => {
      const original = body;

      cy.request({
        method: 'PATCH',
        url: apiUrl(`applications/${applicationId}`),
        body: {
          ...original,
          status: 'Cancelled',
          mainApplicant: {
            ...original.mainApplicant,
            contactInformation: {
              ...original.mainApplicant.contactInformation,
              emailAddress: 'someone.else@example.com',
            },
          },
        },
        failOnStatusCode: false,
      });

      cy.request(apiUrl(`applications/${applicationId}`)).then((res) => {
        expect(res.body.status).to.eq(original.status);
        expect(res.body.mainApplicant.contactInformation.emailAddress).to.eq(
          original.mainApplicant.contactInformation.emailAddress,
        );
      });
    });
  });
});
