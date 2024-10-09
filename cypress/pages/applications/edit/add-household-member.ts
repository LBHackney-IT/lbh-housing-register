class AddHouseholdMemberPage {
  static getAddHouseholdMemberPage() {
    const testId = 'test-application-add-household-member-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static visit(applicationId: string) {
    cy.visit(`/applications/edit/${applicationId}/add-household-member`);
  }

  static getSubmitButton() {
    const testId = 'test-submit-household-member';
    return this.getAddHouseholdMemberPage().find(`[data-testid="${testId}"]`);
  }

  static getTitleDropdown() {
    return this.getAddHouseholdMemberPage().find('#personalDetails_title');
  }

  static getFirstNameInput() {
    return this.getAddHouseholdMemberPage().find('#personalDetails_firstName');
  }

  static getLastNameInput() {
    return this.getAddHouseholdMemberPage().find('#personalDetails_surname');
  }

  static getDoBDayInput() {
    return this.getAddHouseholdMemberPage().find(
      '#personalDetails_dateOfBirth-day'
    );
  }

  static getDoBMonthInput() {
    return this.getAddHouseholdMemberPage().find(
      '#personalDetails_dateOfBirth-month'
    );
  }

  static getDoBYearInput() {
    return this.getAddHouseholdMemberPage().find(
      '#personalDetails_dateOfBirth-year'
    );
  }

  static getGenderDropdown() {
    return this.getAddHouseholdMemberPage().find('#personalDetails_gender');
  }

  static getErrorSummary() {
    const testId = 'test-edit-household-member-error-summary';
    return this.getAddHouseholdMemberPage().find(`[data-testId="${testId}"]`);
  }
}

export default AddHouseholdMemberPage;
