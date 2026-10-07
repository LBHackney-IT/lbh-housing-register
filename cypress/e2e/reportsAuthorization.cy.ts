describe('Reports authorization', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
  });

  ['officer', 'readOnly'].forEach((role) => {
    it(`denies the reports page and API to ${role} staff`, () => {
      cy.loginAsUser(role);

      cy.request({
        method: 'POST',
        url: '/api/reports/novalet/generate',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.deep.eq({ message: 'Access denied' });
      });

      cy.visit('/applications/reports');

      cy.location('pathname').should('eq', '/access-denied');
      cy.contains('Access denied').should('be.visible');
    });
  });
});
