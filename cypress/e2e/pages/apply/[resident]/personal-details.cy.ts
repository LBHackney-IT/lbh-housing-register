import { faker } from '@faker-js/faker';
import ApplyHouseholdPage from '../../../../pages/household';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentPersonalDetailsPage from '../../../../pages/apply/[resident]/personal-details';
import { StatusCodes } from 'http-status-codes';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, true);
const phoneNumber = faker.phone.number();

describe('Apply resident section page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsResident(applicationId, true);
    cy.task('clearNock');
  });

  it('shows saving message when user submits the section', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getApplyResidentSectionPage().should(
      'be.visible'
    );
    cy.contains('Personal details');

    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();
    cy.contains('Saving...');
  });

  it('shows an error messages when the section save fails', () => {
    const errorCode = StatusCodes.CONFLICT;
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getApplyResidentSectionPage().should(
      'be.visible'
    );
    cy.contains('Personal details');

    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();
    ApplyResidentPersonalDetailsPage.getErrorSummary().should('be.visible');
    cy.contains(`Unable to update application (${errorCode})`);
  });
});
