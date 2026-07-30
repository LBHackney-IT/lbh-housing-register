class ReviewApplicantPage {
  static visit(applicationId: string, personId: string) {
    cy.visit(`applications/view/${applicationId}/${personId}`);
  }

  static getMoneySectionNavLink() {
    const testId = 'test-applicant-money-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getHealthSectionNavLink() {
    const testId = 'test-applicant-health-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getLivingSituationSectionNavLink() {
    // No dataTestId prop is passed for this nav item, but HorizontalNavItem
    // always sets a `test-nav-item-${itemName}` testid on its button.
    return cy.get('[data-testid="test-nav-item-livingsituation"]');
  }

  static getViewDocumentsButton() {
    const testId = 'test-view-documents-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ReviewApplicantPage;
