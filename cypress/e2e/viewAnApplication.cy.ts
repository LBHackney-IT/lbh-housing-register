import { faker } from '@faker-js/faker';

import { ApplicationStatus } from '../../lib/types/application-status';
import { generateApplication } from '../../testUtils/applicationHelper';
import ApplicationsPage from '../pages/applications';

describe('User views a resident application', () => {
  it('as a read only group user I cannot edit an application', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);

    cy.clearE2eNock();
    cy.clearCookies();

    cy.loginAsUser('readOnly').then((user) => {
      cy.mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo(user);
      ApplicationsPage.visit();
      ApplicationsPage.getSearchInput().should('be.visible');

      ApplicationsPage.getSearchInput().type(
        application.mainApplicant.person.firstName,
      );
      cy.mockHousingRegisterApiPostSearchResults(application);

      ApplicationsPage.getSearchSubmitButton().click();
      ApplicationsPage.getSearchResultsBox().should('be.visible');

      // Must register before navigating: getServerSideProps fetches on first paint.
      cy.mockHousingRegisterApiGetApplications(
        applicationId,
        application,
        true,
      );

      ApplicationsPage.getViewApplicationLink()
        .first()
        .invoke('attr', 'href')
        .then((href) => {
          const targetId = href.split('/').pop();
          cy.mockActivityHistoryApiEmptyResponse(targetId);
          ApplicationsPage.getViewApplicationLink().first().click();
        });

      ApplicationsPage.getViewApplicationPage().should('be.visible');
      ApplicationsPage.getEditApplicantButton().should('not.exist');
      ApplicationsPage.getEditHouseholdMemberButton().should('not.exist');
      ApplicationsPage.getSensitiveDataButton().should('not.exist');
      ApplicationsPage.getChangeApplicationDateButton().should('not.exist');
      ApplicationsPage.getChangeApplicationStatusButton().should('not.exist');
      ApplicationsPage.getAddHouseholdMemberButton().should('not.exist');
    });
  });

  it('as a manager group user I can edit all application details', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(
      applicationId,
      personId,
      true,
      true,
      true,
      faker.date.recent().toString(),
    );

    cy.clearE2eNock();
    cy.clearCookies();

    cy.loginAsUser('manager').then((user) => {
      cy.mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo(user);
      ApplicationsPage.visit();
      ApplicationsPage.getSearchInput().should('be.visible');
      ApplicationsPage.getSearchInput().type(
        application.mainApplicant.person.firstName,
      );

      cy.mockHousingRegisterApiPostSearchResults(application);

      ApplicationsPage.getSearchSubmitButton().click();
      ApplicationsPage.getSearchResultsBox().should('be.visible');

      cy.mockHousingRegisterApiGetApplications(
        applicationId,
        application,
        true,
      );

      ApplicationsPage.getViewApplicationLink()
        .first()
        .invoke('attr', 'href')
        .then((href) => {
          const targetId = href.split('/').pop();
          cy.mockActivityHistoryApiEmptyResponse(targetId);
          ApplicationsPage.getViewApplicationLink().first().click();
        });

      ApplicationsPage.getViewApplicationPage().should('be.visible');
      ApplicationsPage.getEditApplicantButton().should('be.visible');
      ApplicationsPage.getSensitiveDataButton().should('be.visible');
      ApplicationsPage.getChangeApplicationDateButton().should('be.visible');
      ApplicationsPage.getChangeApplicationStatusButton().should('be.visible');
      ApplicationsPage.getEditHouseholdMemberButton().should('be.visible');
      ApplicationsPage.getAddHouseholdMemberButton().should('be.visible');
    });
  });

  it('denies an officer access to a sensitive application assigned to someone else', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);
    application.sensitiveData = true;
    application.assignedTo = 'another.officer@hackney.gov.uk';
    application.status = ApplicationStatus.SUBMITTED;

    cy.clearE2eNock();
    cy.clearCookies();
    cy.loginAsUser('officer').then(() => {
      cy.mockHousingRegisterApiGetApplications(applicationId, application);
      cy.mockActivityHistoryApiEmptyResponse(applicationId);

      cy.visit(`/applications/view/${applicationId}`);

      cy.contains('h2', 'Access denied').should('be.visible');
      ApplicationsPage.getEditApplicantButton().should('not.exist');
    });
  });

  it('lets an officer view an unassigned submitted case without applicant edit controls', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);
    application.sensitiveData = false;
    application.assignedTo = 'unassigned';
    application.status = ApplicationStatus.SUBMITTED;

    cy.clearE2eNock();
    cy.clearCookies();
    cy.loginAsUser('officer').then(() => {
      cy.mockHousingRegisterApiGetApplications(applicationId, application);
      cy.mockActivityHistoryApiEmptyResponse(applicationId);

      cy.visit(`/applications/view/${applicationId}`);

      ApplicationsPage.getViewApplicationPage().should('be.visible');
      cy.contains('h2', 'Access denied').should('not.exist');
      ApplicationsPage.getEditApplicantButton().should('not.exist');
      ApplicationsPage.getEditHouseholdMemberButton().should('not.exist');
    });
  });

  it('allows an officer to view and edit their assigned submitted application', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);
    application.sensitiveData = true;
    application.status = ApplicationStatus.SUBMITTED;

    cy.clearE2eNock();
    cy.clearCookies();
    cy.loginAsUser('officer').then((user) => {
      application.assignedTo = user.email;
      cy.mockHousingRegisterApiGetApplications(applicationId, application);
      cy.mockActivityHistoryApiEmptyResponse(applicationId);

      cy.visit(`/applications/view/${applicationId}`);

      ApplicationsPage.getViewApplicationPage().should('be.visible');
      cy.contains('h2', 'Access denied').should('not.exist');
      ApplicationsPage.getEditApplicantButton().should('be.visible');
      ApplicationsPage.getChangeApplicationStatusButton().should('be.visible');
    });
  });

  it('keeps existing admin-only semantics for sensitive active applications', () => {
    const personId = faker.string.uuid();
    const applicationId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);
    application.sensitiveData = true;
    application.assignedTo = 'another.officer@hackney.gov.uk';
    application.status = ApplicationStatus.ACTIVE;

    cy.clearE2eNock();
    cy.clearCookies();
    cy.loginAsUser('admin').then(() => {
      cy.mockHousingRegisterApiGetApplications(applicationId, application);
      cy.mockActivityHistoryApiEmptyResponse(applicationId);

      cy.visit(`/applications/view/${applicationId}`);

      cy.contains('h2', 'Access denied').should('not.exist');
      ApplicationsPage.getSensitiveDataButton().should('be.visible');
      ApplicationsPage.getEditApplicantButton().should('not.exist');
    });
  });
});
