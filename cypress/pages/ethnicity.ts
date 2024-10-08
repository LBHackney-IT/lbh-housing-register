class EthnicityPage {
  static getEthnicityPage() {
    const testId = 'test-ethnicity-questions-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/ethnicity-questions`);
  }
  // static getEthnicityRadios() {
  //   const testId = 'test-radio-';
  //   return cy.get(`[data-testid*="${testId}"]`);
  // }
  // static getSaveButton() {
  //   const testId = 'test-submit-form-button';
  //   return cy.get(`[data-testid="${testId}"]`);
  // }
  static getErrorSummary() {
    const testId = 'test-ethnicity-questions-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
  // static getLoadingSpinner() {
  //   const testId = 'test-loading-spinner';
  //   return cy.get(`[data-testid="${testId}"]`);
  // }
}

export default EthnicityPage;
