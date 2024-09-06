import { faker } from '@faker-js/faker';

import { generateApplication } from '../../testUtils/applicationHelper';
import ApplicationsPage from '../pages/applications';
import { screenPresets } from '../support/helpers';

describe('User views a resident application', () => {
  screenPresets.forEach((screenPreset) => {
    ['portrait', 'landscape'].forEach((orientation) => {
      it(`as a read only group user I cannot edit an application on ${screenPreset} in ${orientation} mode`, () => {
        cy.viewport(screenPreset, orientation as Cypress.ViewportOrientation);
        const personId = faker.string.uuid();
        const applicationId = faker.string.uuid();
        const application = generateApplication(applicationId, personId);

        cy.task('clearNock');
        cy.clearCookies();
        cy.loginAsUser('readOnly');

        ApplicationsPage.visit();
        ApplicationsPage.getSearchInput().should('be.visible');

        ApplicationsPage.getSearchInput().type(
          application.mainApplicant.person.firstName
        );

        cy.mockHousingRegisterApiPostSearchResults(application);

        ApplicationsPage.getSearchSubmitButton().click();
        ApplicationsPage.getSearchResultsBox().should('be.visible');
        ApplicationsPage.getViewApplicationLink()
          .first()
          .invoke('attr', 'href')
          .then((href) => {
            const targetId = href.split('/').pop();
            cy.mockActivityHistoryApiEmptyResponse(targetId);
            ApplicationsPage.getViewApplicationLink().first().click();
          });

        cy.mockHousingRegisterApiGetApplications(applicationId, application);

        ApplicationsPage.getViewApplicationPage().should('be.visible');
        ApplicationsPage.getEditApplicantButton().should('not.exist');
        ApplicationsPage.getEditHouseholdMemberButton().should('not.exist');
        ApplicationsPage.getSensitiveDataButton().should('not.exist');
        ApplicationsPage.getChangeApplicationDateButton().should('not.exist');
        ApplicationsPage.getChangeApplicationStatusButton().should('not.exist');
        ApplicationsPage.getAddHouseholdMemberButton().should('not.exist');
      });
    });
  });

  screenPresets.forEach((screenPreset) => {
    ['portrait', 'landscape'].forEach((orientation) => {
      it(`as a manager group user I can edit all application details on ${screenPreset} in ${orientation} mode`, () => {
        const personId = faker.string.uuid();
        const applicationId = faker.string.uuid();
        const application = generateApplication(applicationId, personId);

        cy.task('clearNock');
        cy.clearCookies();
        cy.loginAsUser('manager');

        ApplicationsPage.visit();
        ApplicationsPage.getSearchInput().should('be.visible');
        ApplicationsPage.getSearchInput().type(
          application.mainApplicant.person.firstName
        );

        cy.mockHousingRegisterApiPostSearchResults(application);

        ApplicationsPage.getSearchSubmitButton().click();
        ApplicationsPage.getSearchResultsBox().should('be.visible');

        ApplicationsPage.getViewApplicationLink()
          .first()
          .invoke('attr', 'href')
          .then((href) => {
            const targetId = href.split('/').pop();
            cy.mockActivityHistoryApiEmptyResponse(targetId);
            ApplicationsPage.getViewApplicationLink().first().click();
          });

        cy.mockHousingRegisterApiGetApplications(applicationId, application);

        ApplicationsPage.getViewApplicationPage().should('be.visible');
        ApplicationsPage.getEditApplicantButton().should('be.visible');
        ApplicationsPage.getSensitiveDataButton().should('be.visible');
        ApplicationsPage.getChangeApplicationDateButton().should('be.visible');
        ApplicationsPage.getChangeApplicationStatusButton().should(
          'be.visible'
        );
        ApplicationsPage.getEditHouseholdMemberButton().should('be.visible');
        ApplicationsPage.getAddHouseholdMemberButton().should('be.visible');
      });
    });
  });
});
