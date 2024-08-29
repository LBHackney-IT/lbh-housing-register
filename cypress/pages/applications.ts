class ApplicationsPage {
  static visit() {
    cy.visit('/applications');
  }

  static getApplicationsPage() {
    const testId = 'test-applications-page';
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

  static getAssessment() {
    const testId = 'assessment-test';
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
}
export default ApplicationsPage;
