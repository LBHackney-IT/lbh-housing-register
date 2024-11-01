class ApplicationsPage {
  static visit() {
    cy.visit('/applications');
  }

  static getApplicationsPage() {
    const testId = 'test-applications-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getViewApplicationPage() {
    const testId = 'test-view-application-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSearchInput() {
    return this.getApplicationsPage().find('input[name="search"]');
  }

  static getSearchSubmitButton() {
    return this.getApplicationsPage().find('button[type="submit"]');
  }

  static getWorktray() {
    const testId = 'test-applications-worktray';
    return this.getApplicationsPage().get(`[data-testid="${testId}"]`);
  }

  static getWorktraySidebar() {
    const testId = 'test-admin-sidebar';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSearchInputBox() {
    const testId = 'test-search-box';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSearchResultsBox() {
    const testId = 'test-search-results-box';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getViewApplicationLink() {
    const testIdPrefix = 'test-view-application-link-';
    return this.getSearchResultsBox().get(`[data-testid^="${testIdPrefix}"]`);
  }

  // applications/view/:id
  static getEditApplicantButton() {
    const testIdPrefix = 'test-edit-applicant-button-';
    return cy.get(`[data-testid^="${testIdPrefix}"]`);
  }

  static getEditHouseholdMemberButton() {
    const testIdPrefix = 'test-edit-household-member-button-';
    return cy.get(`[data-testid^="${testIdPrefix}"]`);
  }

  static getAddHouseholdMemberButton() {
    const testId = 'test-add-household-member-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  // sidebar
  static getAssignUserButton() {
    const testId = 'test-assign-user-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getSensitiveDataButton() {
    const testId = 'test-sensitive-data-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getChangeApplicationDateButton() {
    const testId = 'test-change-application-date-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getChangeApplicationStatusButton() {
    const testId = 'test-change-application-status-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ApplicationsPage;
