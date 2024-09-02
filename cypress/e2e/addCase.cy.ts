describe('Add case', () => {
  it('shows access denied page for user with read only permissions', () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit('applications/add-case');
    cy.contains('Access denied');
  });
});
