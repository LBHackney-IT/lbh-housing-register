// import { Application } from '../../domain/HousingApi';

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

  static getViewDocumentsButton() {
    const testId = 'test-view-documents-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  //   static mockHousingRegisterApiGetApplications(
  //     applicationId: string,
  //     application: Application
  //   ) {
  //     cy.task('nock', {
  //       hostname: `${Cypress.env('HOUSING_REGISTER_API')}`,
  //       method: 'GET',
  //       path: `/applications/${applicationId}`,
  //       status: 200,
  //       body: application,
  //     });
  //   }
}

export default ReviewApplicantPage;
