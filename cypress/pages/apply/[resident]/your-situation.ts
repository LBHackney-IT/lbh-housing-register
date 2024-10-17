class ApplyResidentYourSituationPage {
  static visit(personId: string) {
    cy.visit(`/apply/${personId}/your-situation`);
  }

  static getServedInArmedForcesRadioButton() {
    const testId = 'test-radio-situation-armed-forces.1';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getIntentionallyHomelessRadioButton(index: number) {
    const testId = `test-radio-homelessness.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getOwnPropertyRadioButton(index: number) {
    const testId = `test-radio-property-ownership.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSoldPropertyRadioButton(index: number) {
    const testId = `test-radio-sold-property.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getRentArrearsRadioButton(index: number) {
    const testId = `test-radio-arrears.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getBreachOfTenancyRadioButton(index: number) {
    const testId = `test-radio-breach-of-tenancy.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getLegalRestrictionsRadioButton(index: number) {
    const testId = `test-radio-legal-restrictions.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getUnspentConvictionsRadioButton(index: number) {
    const testId = `test-radio-unspent-convictions.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSubmitButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentYourSituationPage;
