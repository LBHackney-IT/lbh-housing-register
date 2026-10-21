import { StatusCodes } from 'http-status-codes';

describe('Sentry monitoring tunnel', () => {
  it('rejects GET /monitoring', () => {
    cy.request({
      url: '/monitoring',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.METHOD_NOT_ALLOWED);
      expect(response.headers.allow).to.eq('POST');
      expect(response.headers['cache-control']).to.eq('private, no-store');
    });
  });

  it('rejects a POST that is not a Sentry envelope', () => {
    cy.request({
      method: 'POST',
      url: '/monitoring',
      body: 'not-an-envelope',
      headers: { 'content-type': 'text/plain' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.BAD_REQUEST);
    });
  });

  it('rejects a trailing-slash monitoring GET after the slash redirect', () => {
    cy.request({
      url: '/monitoring/',
      followRedirect: true,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(StatusCodes.METHOD_NOT_ALLOWED);
    });
  });
});
