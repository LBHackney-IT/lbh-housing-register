import { faker } from '@faker-js/faker/locale/en_GB';
import {
  generateEmailAddress,
  TitleEnum,
} from '../../../testUtils/personHelper';
import AgreeTermsPage from '../../pages/agreeTerms';
import ApplyHouseholdPage from '../../pages/household';
import ApplyExpectPage from '../../pages/apply/expect';
import RejectionPage from '../../pages/rejection';
import ApplyResidentIndexPage from '../../pages/apply/[resident]';
import ApplyResidentPersonalDetailsPage from '../../pages/apply/[resident]/personal-details';
import ApplyResidentSectionPage from '../../pages/apply/[resident]/[section]';
import ApplyResidentAddressHistoryPage from '../../pages/apply/[resident]/address-history';
import ApplyResidentCurrentAccommodationPage from '../../pages/apply/[resident]/current-accommodation';

import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';
import { getDisqualificationReasonOption } from '../../../lib/utils/disqualificationReasonOptions';
import { interceptAddressSearchAPI } from '../../support/intercepts';
import {
  addressSearchAPIResponse,
  fillInTheSignUpForm,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';
import StartPage from '../../pages/start';

const title = faker.helpers.enumValue(TitleEnum);
const phoneNumber = faker.phone.number();
const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();
const postcode = 'A1 2BC';

const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 54 });

const signUpDetails: SignUpFormDetails = {
  title,
  firstName: mainApplicantFirstName,
  lastName: mainApplicantLastName,
  birthDate,
  gender: 'M',
  nationalInsuranceNumber: faker.string.alphanumeric(9),
  phoneNumber,
};

describe('Ineligible main applicant', () => {
  beforeEach(() => {
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    cy.clearAllCookies();
  });

  Cypress._.times(1, () => {
    it(`rejects an applicant who is defined as not lacking rooms`, () => {
      const applicationId = faker.string.uuid();
      cy.loginAsResident(applicationId, false, false);
      const email = generateEmailAddress();

      visitHomepageSignInAndVerify(applicationId, email);
      fillInTheSignUpForm(signUpDetails);
      StartPage.getSubmitButton().click();

      AgreeTermsPage.getAgreeCheckbox().check();
      AgreeTermsPage.getAgreeButton().click();

      ApplyHouseholdPage.getContinueToNextStepLink().click();

      ApplyExpectPage.getContinueToNextStepButton().click();

      cy.get('.lbh-applicant-summary__name')
        .contains(`${mainApplicantFirstName} ${mainApplicantLastName}`)
        .click();

      //main applicant details
      ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
      ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
      ApplyResidentPersonalDetailsPage.getSubmitButton()
        .scrollIntoView()
        .click();

      ApplyResidentIndexPage.getImmigrationStatusSectionLink().click();
      ApplyResidentSectionPage.getImmigrationStatusRadioButton(0).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //medical needs
      cy.get('.lbh-link').contains('Medical needs').click();
      cy.get(`[data-testid="test-radio-medical-needs.1"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //residential status
      cy.get('.lbh-link').contains('Residential status').click();
      cy.get(`[data-testid="test-radio-residential-status.0"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //address history
      //need to mock this to avoid hitting real prod API
      ApplyResidentIndexPage.getAddressHistorySectionLink().click();
      ApplyResidentAddressHistoryPage.getPostcodeInputField().type(postcode, {
        delay: 0,
      });
      ApplyResidentAddressHistoryPage.getFindAddressButton().click();
      ApplyResidentAddressHistoryPage.getMovingDateMonth().type('1', {
        delay: 0,
      });
      ApplyResidentAddressHistoryPage.getMovingDateYear().type('2000', {
        delay: 0,
      });
      ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();
      ApplyResidentAddressHistoryPage.getGetSaveAndContinueButton().click();

      //current accommodation
      cy.get('.lbh-link').contains('Current accommodation').click();
      ApplyResidentCurrentAccommodationPage.getRadioButton().check(
        'private-rental'
      );
      ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
      ApplyResidentCurrentAccommodationPage.getRadioButton().check('flat');
      ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
      ApplyResidentCurrentAccommodationPage.getFloorInput().type('1', {
        delay: 0,
      });
      // Applicant shares with 0 people
      ApplyResidentCurrentAccommodationPage.getShareInput().type('0', {
        delay: 0,
      });
      // Accommodation has 3 bedrooms
      ApplyResidentCurrentAccommodationPage.getBedroomsInput().type('3', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getLivingRoomsInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getDiningRoomsInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getBathRoomsInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getKitchensInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getOtherRoomsInput().type('none', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
      ApplyResidentCurrentAccommodationPage.getUnsuitableHomeReasonInput().type(
        faker.lorem.paragraph(),
        { delay: 0 }
      );
      ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();
      ApplyResidentCurrentAccommodationPage.getLandlordNameInput().type(
        faker.person.fullName(),
        { delay: 0 }
      );
      ApplyResidentCurrentAccommodationPage.getSaveAndContinueButton().click();

      ApplyResidentSummaryPage.getConfirmDetailsButton().click();

      RejectionPage.getRejectionPage().should('be.visible');

      RejectionPage.getRejectionReason().should(
        'contain.text',
        getDisqualificationReasonOption('notLackingRooms')
      );
    });
  });
});
