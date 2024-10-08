class ApplicationEditHouseholdMember {
  static getApplicationUpdateHouseHoldMemberPage() {
    const testId = 'test-application-edit-household-member-page';
    return cy.get(`[data-testId="${testId}"]`);
  }

  static visit(applicationId: string, personId: string) {
    return cy.visit(
      `/applications/edit/${applicationId}/${personId}/edit-household-member`
    );
  }

  static getSubmitButton() {
    return this.getApplicationUpdateHouseHoldMemberPage().find('[type=submit]');
  }

  static getErrorSummary() {
    const testId = 'test-edit-household-member-error-summary';
    return this.getApplicationUpdateHouseHoldMemberPage().find(
      `[data-testId="${testId}"]`
    );
  }
}

export default ApplicationEditHouseholdMember;
