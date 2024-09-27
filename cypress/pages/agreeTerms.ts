class AgreeTermsPage {
  static getAgreeTermsPage() {
    const testId = 'agree-terms-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AgreeTermsPage;
