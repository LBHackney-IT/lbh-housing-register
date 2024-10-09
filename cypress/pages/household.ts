class HouseholdPage {
  static visit() {
    cy.visit(`/apply/household`);
  }

  static getHouseholdPage() {
    const testId = 'test-apply-household-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  // static getContinueToNextStepLink() {
  //   return cy.get('lbh-button').contains('Continue to next step');
  // }
}

export default HouseholdPage;
