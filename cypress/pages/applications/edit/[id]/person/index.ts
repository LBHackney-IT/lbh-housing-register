class ApplicationEditPersonPage {
  static getApplicationEditPersonPage() {
    const testId = 'test-application-edit-person-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static visit(applicationId: string, personId: string) {
    cy.visit(`/applications/edit/${applicationId}/${personId}`);
  }

  static getSubmitMainApplicantDetailsButton() {
    const testId = 'test-submit-main-applicant-button';
    return this.getApplicationEditPersonPage().find(
      `[data-testid="${testId}"]`
    );
  }

  static getLivingSituationDropdown() {
    return this.getApplicationEditPersonPage().find(
      '#currentAccommodation_livingSituation'
    );
  }

  static getCitizenshipDropdown() {
    return this.getApplicationEditPersonPage().find(
      '#immigrationStatus_citizenship'
    );
  }
}

export default ApplicationEditPersonPage;
