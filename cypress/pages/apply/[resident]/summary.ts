class ApplyResidentSummaryPage {
  static visit(personId: string) {
    cy.visit(`/apply/$${personId}/summary`);
  }

  static getApplyResidentSummaryPage() {
    const testId = 'test-apply-resident-summary-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getConfirmDetailsButton() {
    const testId = 'test-apply-resident-summary-confirm-details-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getDeleteThisInformationButton() {
    const testId = 'test-apply-resident-summary-delete-this-information-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getYesDeleteInformationButton() {
    const testId =
      'test-apply-resident-summary-yes-delete-this-information-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentSummaryPage;
