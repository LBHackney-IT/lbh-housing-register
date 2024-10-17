describe('Unassigned - Group worktray', () => {
  it('shows access denied page for user with read only permissions', () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit('applications/unassigned');
    cy.contains('Access denied');
  });
});
