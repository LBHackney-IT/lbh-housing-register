class ApplyResidentAddressHistoryPage {
  static getPostcodeInputField() {
    return cy.get('#postcode');
  }

  static getFindAddressButton() {
    const testId = 'test-apply-resident-address-history-find-address-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getGetSaveAndContinueButton() {
    const testId =
      'test-apply-resident-address-history-save-and-continue-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getMovingDateMonth() {
    return cy.get('#date-month');
  }

  static getMovingDateYear() {
    return cy.get('#date-year');
  }
}

export default ApplyResidentAddressHistoryPage;
