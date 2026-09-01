import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Authentication and authorization boundaries', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
  });

  it('redirects an anonymous staff-page request to login with a return path', () => {
    cy.visit('/applications');

    cy.location('pathname').should('eq', '/login');
    cy.location('search').should('eq', '?returnTo=%2Fapplications');
  });

  it('redirects authenticated staff without an authorised group to access denied', () => {
    cy.loginAsUser('noGroup');

    cy.visit('/applications');

    cy.location('pathname').should('eq', '/access-denied');
  });

  it('does not accept a resident cookie as a staff session', () => {
    cy.loginAsResident(faker.string.uuid(), true);

    cy.visit('/applications');

    cy.location('pathname').should('eq', '/login');
  });

  it('does not accept a resident cookie on a staff write page', () => {
    cy.loginAsResident(faker.string.uuid(), true);

    cy.visit('/applications/add-case');

    cy.location('pathname').should('eq', '/login');
    cy.location('search').should('eq', '?returnTo=%2Fapplications%2Fadd-case');
  });

  it('does not accept a staff cookie as a resident session', () => {
    cy.loginAsUser('officer');

    cy.request({
      method: 'GET',
      url: '/api/applications',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.UNAUTHORIZED);
      expect(response.body).to.deep.eq({ message: 'Unauthorized' });
    });
  });

  it('does not load a resident application page with only a staff cookie', () => {
    cy.loginAsUser('officer');
    cy.intercept('GET', '/api/applications').as('loadResidentApplication');

    cy.visit('/apply/overview');

    cy.wait('@loadResidentApplication')
      .its('response.statusCode')
      .should('eq', StatusCodes.UNAUTHORIZED);
  });

  it('rejects a direct application PATCH from read-only staff', () => {
    const applicationId = faker.string.uuid();
    cy.loginAsUser('readOnly');

    cy.request({
      method: 'PATCH',
      url: `/api/applications/${applicationId}`,
      body: JSON.stringify({ id: applicationId }),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.FORBIDDEN);
      expect(response.body).to.deep.eq({ message: 'Access denied' });
    });
  });

  it('rejects a direct add-case POST from read-only staff', () => {
    cy.loginAsUser('readOnly');

    cy.request({
      method: 'POST',
      url: '/api/applications',
      body: JSON.stringify({}),
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.FORBIDDEN);
      expect(response.body).to.deep.eq({
        message: 'Unable to add application',
      });
    });
  });
});
