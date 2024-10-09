class ApplyResidentIndexPage {
  static visit(personId: string) {
    cy.visit(`/apply/${personId}`);
  }
}

export default ApplyResidentIndexPage;
