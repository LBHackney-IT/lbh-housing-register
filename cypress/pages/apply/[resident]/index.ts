class ApplyResidentIndexPage {
  static visit(personId: string) {
    cy.visit(`/apply/${personId}`);
  }

  static getDeleteThisInformationButton() {
    const testId = 'test-apply-resident-index-delete-this-information-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getYesDeleteButton() {
    const testId =
      'test-apply-resident-index-delete-this-information-confirm-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentIndexPage;
