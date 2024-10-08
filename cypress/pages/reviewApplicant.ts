class ReviewApplicantPage {
  static visit(applicationId: string, personId: string) {
    cy.visit(`applications/view/${applicationId}/${personId}`);
  }

  static getMoneySectionNavLink() {
    const testId = 'test-applicant-money-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getHealthSectionNavLink() {
    const testId = 'test-applicant-health-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getViewDocumentsButton() {
    const testId = 'test-view-documents-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ReviewApplicantPage;
