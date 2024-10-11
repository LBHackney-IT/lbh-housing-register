class ApplyExpectPage {
  static getContinueToNextStepButton() {
    const testId = 'test-apply-expect-save-and-continue-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyExpectPage;
