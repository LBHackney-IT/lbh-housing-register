import ApplicationsPage from '../pages/applications';

describe('View an application', () => {
  it('as a read only user I cannot see edit buttons', () => {
    cy.task('clearNock');
    cy.clearCookies();
    cy.loginAsUser('readOnly');

    ApplicationsPage.visit();
    ApplicationsPage.getSearchInput().should('be.visible');
    ApplicationsPage.getSearchInput().type('1');
    ApplicationsPage.getSearchSubmitButton().click();
    ApplicationsPage.getSearchResultsBox().should('be.visible');

    ApplicationsPage.getViewApplicationLink()
      .first()
      .invoke('attr', 'href')
      .then((href) => {
        const targetId = href.split('/').pop();
        cy.task('nock', {
          hostname: Cypress.env('ACTIVITY_HISTORY_API'),
          method: 'GET',
          path: `/activityhistory?targetId=${targetId}&pageSize=100`,
          status: 200,
          body: {
            results: [{}],
            paginationDetails: { hasNext: false, nextToken: '' },
          },
        });

        ApplicationsPage.getViewApplicationLink().first().click();
        ApplicationsPage.getAssessment().should('not.exist');
      });
  });
});
