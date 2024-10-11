class ApplyResidentSummaryPage {
  static getApplyResidentSummaryPage() {
    const testId = 'test-apply-resident-summary-page';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentSummaryPage;
