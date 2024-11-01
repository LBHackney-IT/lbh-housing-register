class ApplyHouseholdPage {
  static visit() {
    cy.visit(`/apply/household`);
  }

  static getHouseholdPage() {
    const testId = 'test-apply-household-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getContinueToNextStepLink() {
    const testId = 'test-apply-household-index-continue-to-next-step-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getAddHouseholdMemberButton() {
    const testId = 'test-apply-household-add-a-person-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyHouseholdPage;
