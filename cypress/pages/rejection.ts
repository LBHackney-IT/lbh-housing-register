class RejectionPage {
  static getRejectionPage() {
    const testId = 'test-apply-rejection-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static visit() {
    cy.visit(`/apply/not-eligible`);
  }
}

export default RejectionPage;
