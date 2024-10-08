import { faker } from '@faker-js/faker';
import ApplicationEditPersonPage from '../../../../../../pages/applications/edit/[id]/person';
import { generateApplication } from '../../../../../../../testUtils/applicationHelper';
import ViewApplicationPage from '../../../../../../pages/viewApplication';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const submittedAt = faker.date.recent().toISOString();
const application = generateApplication(
  applicationId,
  personId,
  true,
  false,
  false,
  submittedAt
);

describe('Edit person in application', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.loginAsUser('manager');
  });

  it('shows a saving message while application is updating', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);
    cy.mockActivityHistoryApiEmptyResponse(applicationId);

    ApplicationEditPersonPage.visit(applicationId, personId);
    ApplicationEditPersonPage.getApplicationEditPersonPage().should(
      'be.visible'
    );

    //update living situation
    ApplicationEditPersonPage.getLivingSituationDropdown().select(
      'private-rental'
    );

    //update citizenship status
    ApplicationEditPersonPage.getCitizenshipDropdown().select('british');

    ApplicationEditPersonPage.getSubmitMainApplicantDetailsButton().click();
    cy.contains('Saving...');

    //user pushed to view application page
    ViewApplicationPage.getViewApplicationPage().should('be.visible');
  });

  it('shows an error message with correct status code when application update fails', () => {
    const errorCode = StatusCodes.BAD_REQUEST;
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );
    cy.mockActivityHistoryApiEmptyResponse(applicationId);
    ApplicationEditPersonPage.visit(applicationId, personId);
    ApplicationEditPersonPage.getApplicationEditPersonPage().should(
      'be.visible'
    );
    ApplicationEditPersonPage.getLivingSituationDropdown().select(
      'private-rental'
    );
    ApplicationEditPersonPage.getCitizenshipDropdown().select('british');
    ApplicationEditPersonPage.getSubmitMainApplicantDetailsButton().click();
    ApplicationEditPersonPage.getErrorSummary().should('be.visible');
    cy.contains(`Unable to update application (${errorCode})`);

    //user not pushed to view application page
    ViewApplicationPage.getViewApplicationPage().should('not.exist');
  });
});
