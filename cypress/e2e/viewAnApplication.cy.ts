import ApplicationsPage from '../pages/applications';

describe('View an application', () => {
  it('as a read only user I cannot see edit buttons', () => {
    cy.task('clearNock');
    cy.clearCookies();
    cy.loginAsUser('readOnly');

    ApplicationsPage.visit();
    ApplicationsPage.getSearchInput().should('be.visible');
    ApplicationsPage.getSearchInput().type(
      // faker.number.int({ max: 10 }).toString()
      '1'
    );
    ApplicationsPage.getSearchSubmitButton().click();
    ApplicationsPage.getSearchResultsBox().should('be.visible');
    cy.task('nock', {
      hostname: Cypress.env('ACTIVITY_HISTORY_API'),
      method: 'GET',
      path:
        '/activityhistory?targetId=84d87c59-9c87-4f90-89fa-326b5f14869c&pageSize=100',
      status: 200,
      body: {
        results: [{}],
        paginationDetails: { hasNext: false, nextToken: '' },
      },
    });
    ApplicationsPage.getViewApplicationLink().first().click();
  });
});
