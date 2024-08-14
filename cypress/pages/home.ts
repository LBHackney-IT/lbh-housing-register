class HomePage {
  static visit() {
    cy.visit('/');
  }

  static getStartApplicationButton() {
    const testId = 'test-start-application-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  // Cookies banner

  static getCookiesBanner() {
    const testId = 'test-cookie-banner';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getCookiesButton() {
    const testId = 'test-cookie-button';
    return this.getCookiesBanner().get(`[data-testid="${testId}"]`);
  }
}
export default HomePage;
