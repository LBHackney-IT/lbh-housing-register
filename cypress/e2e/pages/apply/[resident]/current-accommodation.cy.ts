import { faker } from '@faker-js/faker';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import ApplyHouseholdPage from '../../../../pages/household';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import { StatusCodes } from 'http-status-codes';
import ApplyResidentCurrentAccommodationPage from '../../../../pages/apply/[resident]/current-accommodation';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);

//mark previous sections as complete, so we can access the accommodation section
const completedSections = [
  {
    answer: 'true',
    id: 'personal-details/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'immigration-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'medical-needs/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'residential-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'address-history/sectionCompleted',
  },
];

const applicationWithCompletedMainApplicantSections = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    questions: completedSections,
  },
};

describe('Apply resident current accommodation page', () => {
  beforeEach(() => {
    cy.loginAsResident(applicationId, true);
    cy.task('clearNock');
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true
    );
  });

  it('shows saving message when user submits accommodation details section', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      1000,
      StatusCodes.OK,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getCurrentAccommodationSectionLink().click();
    ApplyResidentCurrentAccommodationPage.getRadioButton().check(
      'private-rental'
    );
    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    cy.contains('Saving...');
  });

  //different flow for last section, so need to be covered separately
  it('shows saving message when user submits the last accommodation details section', () => {
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      1000,
      StatusCodes.OK,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getCurrentAccommodationSectionLink().click();
    ApplyResidentCurrentAccommodationPage.getRadioButton().check(
      'private-rental'
    );

    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    ApplyResidentCurrentAccommodationPage.getDescribeHomeRadioButton(0).check();
    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    ApplyResidentCurrentAccommodationPage.getFloorInput().type('1');
    ApplyResidentCurrentAccommodationPage.getShareInput().type('3');
    ApplyResidentCurrentAccommodationPage.getBedroomsInput().type('1');
    ApplyResidentCurrentAccommodationPage.getLivingRoomsInput().type('1');
    ApplyResidentCurrentAccommodationPage.getDiningRoomsInput().type('0');
    ApplyResidentCurrentAccommodationPage.getBathRoomsInput().type('1');
    ApplyResidentCurrentAccommodationPage.getKitchensInput().type('1');
    ApplyResidentCurrentAccommodationPage.getOtherRoomsInput().type('none');
    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    ApplyResidentCurrentAccommodationPage.getUnsuitableHomeReasonInput().type(
      faker.lorem.paragraph()
    );
    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    ApplyResidentCurrentAccommodationPage.getLandlordNameInput().type(
      faker.person.fullName()
    );
    ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
    cy.contains('Saving...');
  });
});
