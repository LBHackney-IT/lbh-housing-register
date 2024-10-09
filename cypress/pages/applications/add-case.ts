class AddCasePage {
  static getAddCasePage() {
    const testId = 'test-add-case-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static visit() {
    cy.visit('applications/add-case');
  }

  static getSubmitButton() {
    return this.getAddCasePage().find('button[type=submit]');
  }

  static getTitleDropdown() {
    return this.getAddCasePage().find('#personalDetails_title');
  }

  static getFirstNameInput() {
    return this.getAddCasePage().find('#personalDetails_firstName');
  }

  static getLastNameInput() {
    return this.getAddCasePage().find('#personalDetails_surname');
  }

  static getDoBDayInput() {
    return this.getAddCasePage().find('#personalDetails_dateOfBirth-day');
  }

  static getDoBMonthInput() {
    return this.getAddCasePage().find('#personalDetails_dateOfBirth-month');
  }

  static getDoBYearInput() {
    return this.getAddCasePage().find('#personalDetails_dateOfBirth-year');
  }

  static getGenderDropdown() {
    return this.getAddCasePage().find('#personalDetails_gender');
  }

  static getLivingSituationDropdown() {
    return this.getAddCasePage().find('#currentAccommodation_livingSituation');
  }

  static getCitizenshipDropdown() {
    return this.getAddCasePage().find('#immigrationStatus_citizenship');
  }

  static getAddAddressButton() {
    const testId = 'test-add-case-address-button';
    return this.getAddCasePage().find(`[data-testId="${testId}"]`);
  }

  static getAddressLine1Input() {
    return cy.get('input[name="line1"]');
  }

  static getSaveAddressButton() {
    const testId = 'test-save-case-address-button';
    return cy.get(`[data-testId="${testId}"]`);
  }
}

export default AddCasePage;
