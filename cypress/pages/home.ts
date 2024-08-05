class HomePage {
  static visit() {
    cy.visit('/');
  }

  static getStartApplicationButton() {
    const testId = "test-start-application-button";
    return cy.get(`[data-testid="${testId}"]`);
  }
}
export default HomePage;
