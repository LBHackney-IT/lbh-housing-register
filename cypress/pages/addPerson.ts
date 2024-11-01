class AddPersonPage {
  static visit() {
    cy.visit(`/apply/household/add-person`);
  }
  static getAddPersonPage() {
    const testId = 'test-application-add-person';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getTitleDropdown() {
    const testId = 'test-select-title';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getFirstNameInput() {
    const testId = 'test-input-firstName';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getLastNameInput() {
    const testId = 'test-input-surname';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getRelationshipDropdown() {
    const testId = 'test-select-relationshipType';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getDoBDayInput() {
    const testId = 'test-date-input-day';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getDoBMonthInput() {
    const testId = 'test-date-input-month';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getDoBYearInput() {
    const testId = 'test-date-input-year';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getGenderDropdown() {
    return this.getAddPersonPage().find('input[type="radio"]');
  }

  static getSubmitButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AddPersonPage;
