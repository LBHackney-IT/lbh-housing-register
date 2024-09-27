class AgreeTermsPage {
  static getAgreeTermsPage() {
    const testId = 'test-agree-terms-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AgreeTermsPage;
