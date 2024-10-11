class ApplyOverviewPage {
  static getApplicantButton(personId: string) {
    return cy.get(
      `[data-testid="test-application-applicant-summary-section-button-${personId}"]`
    );
  }
}

export default ApplyOverviewPage;
