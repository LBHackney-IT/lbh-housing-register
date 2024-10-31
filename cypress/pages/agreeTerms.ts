class AgreeTermsPage {
  static getAgreeTermsPage() {
    const testId = 'test-agree-terms-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/agree-terms`);
  }
  static getAgreeCheckbox() {
    const testId = 'test-checkbox';
    return cy.get(`[data-testid*="${testId}"]`);
  }
  static getAgreeButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getErrorSummary() {
    const testId = 'test-agree-terms-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AgreeTermsPage;
