class Components {
  static getLoadingSpinner() {
    const testId = 'test-loading-spinner';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getSaveButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getRadioButtons() {
    const testId = 'test-radio-';
    return cy.get(`[data-testid*="${testId}"]`);
  }
  static getCheckboxes() {
    const testId = 'test-checkbox-';
    return cy.get(`[data-testid*="${testId}"]`);
  }
  static getConditionalCheckboxes() {
    const testId = 'test-checkbox-conditional-';
    return cy.get(`[data-testid*="${testId}"]`);
  }
}

export default Components;
