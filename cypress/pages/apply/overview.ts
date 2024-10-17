class ApplyOverviewPage {
  static getApplyOverviewPage() {
    return cy.get(`[data-testid="test-apply-resident-overview-page"]`);
  }

  static getApplicantButton(personId: string) {
    return cy.get(
      `[data-testid="test-application-applicant-summary-section-button-${personId}"]`
    );
  }
}

export default ApplyOverviewPage;
