import { faker } from '@faker-js/faker';
import ApplyResidentAddressHistoryPage from '../../../../pages/apply/[resident]/address-history';
import ApplyHouseholdPage from '../../../../pages/household';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import {
  completedApplicationFormSections,
  generateApplication,
} from '../../../../../testUtils/applicationHelper';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);
const postcode = 'A1 1AB';

//mark all sections as complete, so we can access them without filling them all in
const applicationWithCompletedMainApplicantSections = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    questions: completedApplicationFormSections,
  },
};

describe('Apply resident address history page', () => {
  beforeEach(() => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true
    );
    cy.mockAddressAPISearchByPostcode(postcode);
  });

  it('shows saving message when user submits the address history form', () => {
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getAddressHistorySectionLink().click();

    ApplyResidentAddressHistoryPage.getPostcodeInputField().type(postcode);
    ApplyResidentAddressHistoryPage.getFindAddressButton().click();
    ApplyResidentAddressHistoryPage.getMovingDateMonth().type('1');
    ApplyResidentAddressHistoryPage.getMovingDateYear().type('2000');
    ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();
    //same button used to submit the details
    ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();
    cy.contains('Saving...');
    //ensure we are back on the index page
    ApplyResidentIndexPage.getApplyResidentIndexPage().should('be.visible');
  });

  it('shows error message when application update fails', () => {
    const errorCode = StatusCodes.CONFLICT;
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
    ApplyResidentIndexPage.getAddressHistorySectionLink().click();

    ApplyResidentAddressHistoryPage.getPostcodeInputField().type(postcode);
    ApplyResidentAddressHistoryPage.getFindAddressButton().click();
    ApplyResidentAddressHistoryPage.getMovingDateMonth().type('1');
    ApplyResidentAddressHistoryPage.getMovingDateYear().type('2000');
    ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();
    //same button used to submit the details
    ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();
    cy.contains('Unable to update application (409)');
  });
});
