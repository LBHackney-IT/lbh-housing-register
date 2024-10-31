class ApplyResidentPersonalDetailsPage {
  static getApplyResidentSectionPage() {
    const testId = `test-apply-resident-personal-details-step`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSubmitButton() {
    return cy.get('button[type="submit"]');
  }

  static getPhoneNumberInput() {
    return cy.get('#phoneNumber');
  }

  static getNINumberInput() {
    const testId = `test-input-nationalInsuranceNumber`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getErrorSummary() {
    const testId = 'test-apply-resident-personal-details-step-error-summary';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentPersonalDetailsPage;
