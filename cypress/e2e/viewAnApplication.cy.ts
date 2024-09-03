import ApplicationsPage from '../pages/applications';
import { screenPresets } from '../support/helpers';

describe('Application view page', () => {
  screenPresets.forEach((screenPreset) => {
    it(`as a read only group user I cannot edit application details on ${screenPreset}`, () => {
      cy.viewport(screenPreset);

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
        });

      ApplicationsPage.getEditApplicantButton().should('not.exist');
      ApplicationsPage.getEditHouseholdMemberButton().should('not.exist');
      ApplicationsPage.getSensitiveDataButton().should('not.exist');
      ApplicationsPage.getChangeApplicationDateButton().should('not.exist');
      ApplicationsPage.getChangeApplicationStatusButton().should('not.exist');
      ApplicationsPage.getAddHouseholdMemberButton().should('not.exist');

      cy.task('clearNock');
    });
  });
  screenPresets.forEach((screenPreset) => {
    it(`as a manager group user I can edit all application details on ${screenPreset}`, () => {
      cy.viewport(screenPreset);

      cy.task('clearNock');
      cy.clearCookies();
      cy.loginAsUser('manager');

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
        });

      ApplicationsPage.getEditApplicantButton().should('be.visible');
      ApplicationsPage.getEditHouseholdMemberButton().should('be.visible');
      ApplicationsPage.getSensitiveDataButton().should('be.visible');
      ApplicationsPage.getChangeApplicationDateButton().should('be.visible');
      ApplicationsPage.getChangeApplicationStatusButton().should('be.visible');
      ApplicationsPage.getAddHouseholdMemberButton().should('be.visible');
      cy.task('clearNock');
    });
  });
});
