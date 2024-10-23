class EthnicityPage {
  static getEthnicityPage() {
    const testId = 'test-ethnicity-questions-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/ethnicity-questions`);
  }

  static getErrorSummary() {
    const testId = 'test-ethnicity-questions-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default EthnicityPage;
