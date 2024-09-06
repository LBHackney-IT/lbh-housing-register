import { Application } from '../../domain/HousingApi';

class ViewApplicationPage {
  static visit(applicationId: string) {
    cy.visit(`/applications/view/${applicationId}`);
  }

  static getAssessmentNavLink() {
    const testId = 'test-applicant-assessment-section-navigation';
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

  static mockActivityHistoryApi(targetId) {
    cy.task('nock', {
      hostname: `${Cypress.env('ACTIVITY_HISTORY_API')}`,
      method: 'GET',
      path: `/activityhistory?targetId=${targetId}&pageSize=100`,
      status: 200,
      body: {
        results: [{}],
        paginationDetails: { hasNext: false, nextToken: '' },
      },
    });
  }
}

export default ViewApplicationPage;
