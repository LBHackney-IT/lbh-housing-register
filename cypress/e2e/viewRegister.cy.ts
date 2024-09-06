describe('View register - All applications', () => {
  it('shows access denied page for user with read only permissions', () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit('applications/view-register');
    cy.contains('Access denied');
  });
});
