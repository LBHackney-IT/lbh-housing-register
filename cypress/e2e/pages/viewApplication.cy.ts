import { faker } from '@faker-js/faker';

import { ApplicationStatus } from '../../../lib/types/application-status';
import { generateApplication } from '../../../testUtils/applicationHelper';
import ViewApplicationPage from '../../pages/viewApplication';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();

describe('View a resident application', () => {
  beforeEach(() => {
    cy.task('clearNock');
    cy.clearAllCookies();
  });

  it('does not show the assessment area for read only users', () => {
    const application = generateApplication(applicationId, personId);
    //ensure application requires assessment
    application.status = ApplicationStatus.SUBMITTED;

    cy.loginAsUser('readOnly');
    cy.mockActivityHistoryApiEmptyResponse(applicationId);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

    ViewApplicationPage.visit(applicationId);
    ViewApplicationPage.getAssessmentNavLink().should('not.exist');
  });

  it('shows an error message when deleting household member fails', () => {
    const submittedAt = faker.date.recent().toISOString();
    const errorCode = StatusCodes.CONFLICT;

    const application = generateApplication(
      applicationId,
      personId,
      true,
      true,
      true,
      submittedAt
    );

    cy.loginAsUser('manager');
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      application,
      true,
      0,
      StatusCodes.OK
    );
    cy.mockActivityHistoryApiEmptyResponse(applicationId, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    ViewApplicationPage.visit(applicationId);

    ViewApplicationPage.getRemoveHouseHoldMemberButton(personId + 1).click();
    cy.contains('Confirm delete');
    ViewApplicationPage.getRemoveHouseHoldMemberConfirmationButton(
      personId + 1
    ).should('be.visible');
    ViewApplicationPage.getRemoveHouseHoldMemberConfirmationButton(
      personId + 1
    ).click();
    ViewApplicationPage.getErrorSummary().should('be.visible');
    cy.contains(`Unable to delete household member`);
  });
});
