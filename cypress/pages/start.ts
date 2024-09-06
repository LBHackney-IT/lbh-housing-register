class StartPage {
  static getStartApplicationPage() {
    const testId = 'test-start-application-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
}
export default StartPage;
