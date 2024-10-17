class ApplyResidentIndexPage {
  static visit(personId: string) {
    cy.visit(`/apply/${personId}`);
  }

  static getApplyResidentIndexPage() {
    const testId = 'test-apply-resident-index-page';
    return cy.get(`[data-testid="${testId}"]`);
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

  static getPersonalDetailsSectionLink() {
    return cy.get('.lbh-link').contains('Personal details');
  }

  static getAddressHistorySectionLink() {
    return cy.get('.lbh-link').contains('Address history');
  }

  static getCurrentAccommodationSectionLink() {
    return cy.get('.lbh-link').contains('Current accommodation');
  }

  static getCheckAnswersButton() {
    const testId = 'test-apply-resident-index-check-answers-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplyResidentIndexPage;
