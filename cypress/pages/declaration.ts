class DeclarationPage {
  static getDeclarationPage() {
    const testId = 'test-declaration-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/declaration`);
  }
  static getErrorSummary() {
    const testId = 'test-declaration-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSubmitButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default DeclarationPage;
