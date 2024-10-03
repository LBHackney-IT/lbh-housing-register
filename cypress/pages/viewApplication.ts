import { Application } from '../../domain/HousingApi';

class ViewApplicationPage {
  static visit(applicationId: string) {
    cy.visit(`/applications/view/${applicationId}`);
  }

  static getAssessmentNavLink() {
    const testId = 'test-applicant-assessment-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getViewApplicationPage() {
    const testId = 'test-view-application-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static mockHousingRegisterApiGetApplications(
    applicationId: string,
    application: Application
  );

  static mockHousingRegisterApiGetApplications(
    applicationId: string,
    application: Application
  ) {
    cy.task('nock', {
      hostname: `${Cypress.env('HOUSING_REGISTER_API')}`,
      method: 'GET',
      path: `/applications/${applicationId}`,
      status: 200,
      body: application,
    });
  }
}

export default ViewApplicationPage;
