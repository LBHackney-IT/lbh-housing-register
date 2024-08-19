import { faker } from '@faker-js/faker/locale/en_GB';

import ApplicationsPage from '../pages/applications';

describe('Search for an application', () => {
  it('as a read only user I only see the search results', () => {
    // cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    ApplicationsPage.visit();

    ApplicationsPage.getApplicationsPage().should('be.visible');

    // can see the application page and search bar
    ApplicationsPage.getSearchInput().should('be.visible');
    // doesn't see the worktray
    ApplicationsPage.getWorktray().should('not.exist');
    ApplicationsPage.getWorktraySidebar().should('not.exist');

    // can search for an application
    ApplicationsPage.getSearchInput().type(faker.lorem.words(2));
    ApplicationsPage.getSearchSubmitButton().click();

    // can see the search results
    ApplicationsPage.getSearchResults().should('be.visible');

    // doesn't see the sidebar

    ApplicationsPage.getWorktraySidebar().should('not.exist');
  });
  it('as an officer I can engage with worktray', () => {
    // cy.clearAllCookies();
    cy.loginAsUser('officer');
    ApplicationsPage.visit();

    ApplicationsPage.getApplicationsPage().should('be.visible');

    // can see the application page and search bar
    ApplicationsPage.getSearchInput().should('be.visible');

    // can see the worktray
    ApplicationsPage.getWorktray().should('be.visible');
    ApplicationsPage.getWorktraySidebar().should('be.visible');

    // can search for an application
    ApplicationsPage.getSearchInput().type(faker.lorem.words(2));
    ApplicationsPage.getSearchSubmitButton().click();

    // can see the search results
    ApplicationsPage.getSearchResults().should('be.visible');

    // can see the sidebar
    ApplicationsPage.getWorktraySidebar().should('be.visible');
  });
});
