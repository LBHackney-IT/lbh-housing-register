class EthnicityPage {
  static getEthnicityPage() {
    const testId = 'test-ethnicity-questions-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/submit/ethnicity-questions`);
  }
  static expectLoaded() {
    cy.url({ timeout: 30000 }).should(
      'include',
      '/apply/submit/ethnicity-questions',
    );
    EthnicityPage.getEthnicityPage().should('exist');
  }

  static getRadioButtons() {
    return EthnicityPage.getEthnicityPage().find(
      '[data-testid*="test-radio-"]',
    );
  }

  static clickRandomRadioOption() {
    EthnicityPage.getRadioButtons().then((radioButtons) => {
      const randomIndex = Math.floor(Math.random() * radioButtons.length);
      cy.wrap(radioButtons.eq(randomIndex)).click();
    });
  }

  static getErrorSummary() {
    const testId = 'test-ethnicity-questions-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default EthnicityPage;
