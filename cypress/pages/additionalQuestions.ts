class AdditionalQuestionsPage {
  static getAdditionalQuestionsPage() {
    const testId = 'test-additional-questions-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/additional-questions`);
  }
  static getSaveAndContinueButton() {
    const testId = 'test-additional-questions-save-and-continue';
    return AdditionalQuestionsPage.getAdditionalQuestionsPage().find(
      `[data-testid="${testId}"]`,
    );
  }
  static clickSaveAndContinue() {
    return AdditionalQuestionsPage.getSaveAndContinueButton()
      .scrollIntoView()
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }
  static expectLoaded() {
    cy.url({ timeout: 30000 }).should(
      'include',
      '/apply/submit/additional-questions',
    );
    AdditionalQuestionsPage.getAdditionalQuestionsPage().should('exist');
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
