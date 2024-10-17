class ViewApplicationPage {
  static visit(applicationId: string) {
    cy.visit(`/applications/view/${applicationId}`);
  }

  static getNotesAndHistorySection() {
    const testId = 'test-applicant-notes-and-history-section';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getAssessmentNavLink() {
    const testId = 'test-applicant-assessment-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getRemoveHouseHoldMemberButton(personId: string) {
    const testId = `test-remove-household-member-button-${personId}`;
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getViewApplicationPage() {
    const testId = 'test-view-application-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getRemoveHouseHoldMemberConfirmationButton(personId: string) {
    const testId = `test-remove-household-member-confirmation-button-${personId}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getErrorSummary() {
    const testId = 'test-view-application-page-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ViewApplicationPage;
