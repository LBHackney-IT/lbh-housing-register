class HouseholdPage {
  static visit() {
    cy.visit(`/apply/household`);
  }
  static getHouseholdPage() {
    const testId = 'test-apply-household-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default HouseholdPage;
