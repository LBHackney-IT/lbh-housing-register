//shared with all single step form sections
class ApplyResidentSectionPage {
  static getSubmitButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getImmigrationStatusRadioButton(index: number) {
    const testId = `test-radio-citizenship.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentSectionPage;
