class AddPersonPage {
  static visit() {
    cy.visit(`/apply/household/add-person`);
  }
  static getAddPersonPage() {
    const testId = 'test-application-add-person';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default AddPersonPage;
