import { faker } from '@faker-js/faker';
import ApplicationEditHouseholdMember from '../../../../../../pages/applications/edit/[id]/person/edit-household-member';
import { generateApplication } from '../../../../../../../testUtils/applicationHelper';
import { Application } from '../../../../../../../domain/HousingApi';
import ApplicationsPage from '../../../../../../pages/applications';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application: Application = generateApplication(
  applicationId,
  personId,
  true,
  true
);

describe('Edit household member', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.loginAsUser('manager');
  });

  it('shows saving message when application is updated', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);
    cy.mockActivityHistoryApiEmptyResponse(applicationId);

    //add +1 to the household member ID to follow the current helper logic
    ApplicationEditHouseholdMember.visit(applicationId, personId + 1);
    ApplicationEditHouseholdMember.getApplicationUpdateHouseHoldMemberPage().should(
      'be.visible'
    );

    ApplicationEditHouseholdMember.getSubmitButton().click();

    cy.contains('Saving...');

    ApplicationsPage.getViewApplicationPage().should('be.visible');
  });

  it('shows an error message with correct status code when saving application fails', () => {
    const errorCode = StatusCodes.CONFLICT;
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    ApplicationEditHouseholdMember.visit(applicationId, personId + 1);
    ApplicationEditHouseholdMember.getSubmitButton().click();

    ApplicationEditHouseholdMember.getErrorSummary().should('be.visible');
    cy.contains(`Unable to update application (${errorCode})`);
  });
});
