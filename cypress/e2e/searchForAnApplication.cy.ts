import { faker } from '@faker-js/faker/locale/en_GB';

import { generateApplication } from '../../testUtils/applicationHelper';
import ApplicationsPage from '../pages/applications';

describe('User searches for an application', () => {
  it(`as a user in the read only group I only see the search results`, () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);

    cy.task('clearNock');
    cy.clearCookies();
    cy.loginAsUser('readOnly');
    ApplicationsPage.visit();
    ApplicationsPage.getApplicationsPage().should('be.visible');
    ApplicationsPage.getSearchInput().should('be.visible');
    ApplicationsPage.getWorktray().should('not.exist');
    ApplicationsPage.getWorktraySidebar().should('not.exist');
    ApplicationsPage.getSearchInput().type(
      application.mainApplicant.person.firstName
    );
    cy.mockHousingRegisterApiPostSearchResults(application);

    ApplicationsPage.getSearchSubmitButton().click();
    ApplicationsPage.getSearchInputBox().should('be.visible');
    ApplicationsPage.getWorktraySidebar().should('not.exist');
  });

  it(`as a user in the officer group I can engage with the worktray features`, () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);
    cy.task('clearNock');
    cy.clearCookies();
    cy.loginAsUser('officer');

    ApplicationsPage.visit();
    ApplicationsPage.getApplicationsPage().should('be.visible');
    ApplicationsPage.getSearchInput().should('be.visible');
    ApplicationsPage.getWorktray().should('be.visible');
    ApplicationsPage.getWorktraySidebar().should('be.visible');
    ApplicationsPage.getSearchInput().type(
      application.mainApplicant.person.firstName
    );
    cy.mockHousingRegisterApiPostSearchResults(application);
    ApplicationsPage.getSearchSubmitButton().click();
    ApplicationsPage.getSearchResultsBox().should('be.visible');
    ApplicationsPage.getWorktraySidebar().should('be.visible');
  });
});
