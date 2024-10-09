class ConfirmationPage {
  static getConfirmationPage() {
    const testId = 'test-apply-confirmation-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/confirmation`);
  }
}

export default ConfirmationPage;
