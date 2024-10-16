class StartPage {
  static getStartApplicationPage() {
    const testId = 'test-start-application-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static visit() {
    cy.visit(`/apply/start`);
  }

  static getTitleDropdown() {
    return this.getStartApplicationPage().find('select');
  }

  static getFirstNameInput() {
    return this.getStartApplicationPage().find('#firstName');
  }

  static getLastNameInput() {
    return this.getStartApplicationPage().find('#surname');
  }

  static getDoBDayInput() {
    return this.getStartApplicationPage().find('#dateOfBirth-day');
  }

  static getDoBMonthInput() {
    return this.getStartApplicationPage().find('#dateOfBirth-month');
  }

  static getDoBYearInput() {
    return this.getStartApplicationPage().find('#dateOfBirth-year');
  }

  static getGenderOptions() {
    return this.getStartApplicationPage().find('[type=radio]');
  }

  static getNationalInsuranceNumberInput() {
    return this.getStartApplicationPage().find('#nationalInsuranceNumber');
  }

  static getPhoneNumberInput() {
    return this.getStartApplicationPage().find('#phoneNumber');
  }

  static getSubmitButton() {
    return this.getStartApplicationPage().find('button[type="submit"]');
  }

  static getErrorSummary() {
    const testId = 'test-start-page-error-summary';
    return this.getStartApplicationPage().find(`[data-testid="${testId}"]`);
  }
}
export default StartPage;
