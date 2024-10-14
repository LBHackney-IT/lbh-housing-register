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
  static getSelect(label: string) {
    const testId = `test-select-${label}`;
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getInput(label: string) {
    const testId = `test-input-${label}`;
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getDateInput(value: string) {
    const testId = `test-date-input-${value}`;
    return cy.get(`[data-testid="${testId}"]`);
  }
  static getErrorSumamry(value: string) {
    const testId = `test-${value}-error-summary`;
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default Components;
