import { faker } from '@faker-js/faker/locale/en_GB';

import ApplicationsPage from '../pages/applications';
import { screenPresets } from '../support/helpers';

describe('Search for an application', () => {
  screenPresets.forEach((screenPreset) => {
    it(`as a user in the read only group I only see the search results on ${screenPreset}`, () => {
      cy.viewport(screenPreset);
      cy.clearCookies();
      cy.loginAsUser('readOnly');
      ApplicationsPage.visit();
      ApplicationsPage.getApplicationsPage().should('be.visible');
      ApplicationsPage.getSearchInput().should('be.visible');
      ApplicationsPage.getWorktray().should('not.exist');
      ApplicationsPage.getWorktraySidebar().should('not.exist');
      ApplicationsPage.getSearchInput().type(faker.lorem.words(2));
      ApplicationsPage.getSearchSubmitButton().click();
      ApplicationsPage.getSearchInputBox().should('be.visible');
      ApplicationsPage.getWorktraySidebar().should('not.exist');
    });
  });
  screenPresets.forEach((screenPreset) => {
    it(`as a user in the officer group I can engage with worktray on ${screenPreset}`, () => {
      cy.viewport(screenPreset);
      cy.clearCookies();
      cy.loginAsUser('officer');
      ApplicationsPage.visit();
      ApplicationsPage.getApplicationsPage().should('be.visible');
      ApplicationsPage.getSearchInput().should('be.visible');
      ApplicationsPage.getWorktray().should('be.visible');
      ApplicationsPage.getWorktraySidebar().should('be.visible');
      ApplicationsPage.getSearchInput().type(faker.lorem.words(2));
      ApplicationsPage.getSearchSubmitButton().click();
      ApplicationsPage.getSearchResultsBox().should('be.visible');
      ApplicationsPage.getWorktraySidebar().should('be.visible');
    });
  });
});
