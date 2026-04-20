class ApplyOverviewPage {
  static getApplyOverviewPage() {
    return cy.get(`[data-testid="test-apply-resident-overview-page"]`);
  }

  static getApplicantButton(personId: string) {
    return cy.get(
      `[data-testid="test-application-applicant-summary-section-button-${personId}"]`,
    );
  }

  /**
   * Next.js <Link> can unmount the overview during Cypress's actionability wait.
   * force skips that wait while still performing a real click (client-side navigation).
   */
  static openApplicant(personId: string) {
    this.getApplicantButton(personId)
      .should('be.visible')
      .click({ force: true });
  }
}

export default ApplyOverviewPage;
