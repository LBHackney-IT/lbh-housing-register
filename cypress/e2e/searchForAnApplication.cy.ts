import { faker } from '@faker-js/faker/locale/en_GB';

import ApplicationsPage from '../pages/applications';
import { screenPresets } from '../support/helpers';

describe('Search for an application', () => {
  screenPresets.forEach((screenPreset) => {
    it('as a read only user I only see the search results', () => {
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

      ApplicationsPage.getSearchResults().should('be.visible');

      ApplicationsPage.getWorktraySidebar().should('not.exist');
    });
  });
  screenPresets.forEach((screenPreset) => {
    it('as an officer I can engage with worktray', () => {
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

      ApplicationsPage.getSearchResults().should('be.visible');

      ApplicationsPage.getWorktraySidebar().should('be.visible');
    });
  });
});
