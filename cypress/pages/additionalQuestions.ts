class AdditionalQuestionsPage {
  static getAdditionalQuestionsPage() {
    const testId = 'test-additional-questions-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/additional-questions`);
  }
  static getAdditionalQuestionsNotes() {
    const testId = 'test-checkbox-conditional-container';
    return cy.get(`[data-testid*="${testId}"]`);
  }
  static getErrorSummary() {
    const testId = 'test-additional-questions-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AdditionalQuestionsPage;
