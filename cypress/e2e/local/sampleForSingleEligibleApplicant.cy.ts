import { faker } from '@faker-js/faker/locale/en_GB';
import StartPage from '../../pages/start';
import {
  generateEmailAddress,
  TitleEnum,
} from '../../../testUtils/personHelper';
import AgreeTermsPage from '../../pages/agreeTerms';
import ApplyHouseholdPage from '../../pages/household';
import ApplyExpectPage from '../../pages/apply/expect';
import ApplyResidentIndexPage from '../../pages/apply/[resident]';
import ApplyResidentPersonalDetailsPage from '../../pages/apply/[resident]/personal-details';
import ApplyResidentSectionPage from '../../pages/apply/[resident]/[section]';
import ApplyResidentAddressHistoryPage from '../../pages/apply/[resident]/address-history';
import ApplyResidentCurrentAccommodationPage from '../../pages/apply/[resident]/current-accommodation';
import ApplyResidentYourSituationPage from '../../pages/apply/[resident]/your-situation';
import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';
import DeclarationPage from '../../pages/declaration';
import {
  addressSearchAPIResponse,
  fillInTheSignUpForm,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';
import { interceptAddressSearchAPI } from '../../support/intercepts';
import Components from '../../pages/components';

//ensure eligibility: over 55 and alone
const birthDate = faker.date.birthdate({ mode: 'age', min: 56, max: 90 });
const title = faker.helpers.enumValue(TitleEnum);
const phoneNumber = faker.phone.number();
const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();
const postcode = 'A1 2BC';

const signUpDetails: SignUpFormDetails = {
  title,
  firstName: mainApplicantFirstName,
  lastName: mainApplicantLastName,
  birthDate,
  gender: 'M',
  nationalInsuranceNumber: faker.string.alphanumeric(9),
  phoneNumber,
};

describe('Single main applicant, over 55', () => {
  beforeEach(() => {
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    cy.clearAllCookies();
  });

  Cypress._.times(1, () => {
    it(`allows eligible applicant to fill in and submit the application`, () => {
      const applicationId = faker.string.uuid();
      cy.loginAsResident(applicationId, false, false);
      const email = generateEmailAddress();

      visitHomepageSignInAndVerify(applicationId, email);
      fillInTheSignUpForm(signUpDetails);
      StartPage.getSubmitButton().click();

      //agree terms
      AgreeTermsPage.getAgreeCheckbox().check();
      AgreeTermsPage.getAgreeButton().click();

      //household index
      ApplyHouseholdPage.getContinueToNextStepLink().click();

      //expect
      ApplyExpectPage.getContinueToNextStepButton().click();

      //apply overview/ fill in main applicant details
      //we have no means of retrieving the person id in these tests at the moment, so have to use their name to get the correct link
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
      ApplyResidentCurrentAccommodationPage.getShareInput().type('3', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getBedroomsInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getLivingRoomsInput().type('1', {
        delay: 0,
      });
      ApplyResidentCurrentAccommodationPage.getDiningRoomsInput().type('0', {
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

      ApplyResidentIndexPage.getYourSituationSectionLink().click();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getServedInArmedForcesRadioButton(
        1
      ).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getIntentionallyHomelessRadioButton(
        1
      ).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getOwnPropertyRadioButton(1).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getSoldPropertyRadioButton(1).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getRentArrearsRadioButton(1).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getBreachOfTenancyRadioButton(1).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getLegalRestrictionsRadioButton(1).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();
      ApplyResidentYourSituationPage.getUnspentConvictionsRadioButton(
        1
      ).check();
      ApplyResidentYourSituationPage.getSubmitButton().click();

      //employment
      cy.get('.lbh-link').contains('Employment').click();
      //unemployed
      cy.get(`[data-testid="test-radio-employment.3"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //income and savings
      cy.get('.lbh-link').contains('Income and savings').click();
      cy.get(`[data-testid="test-radio-income.0"]`).check();
      cy.get(`[data-testid="test-radio-savings.0"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //confirm details
      ApplyResidentIndexPage.getCheckAnswersButton().click();
      ApplyResidentSummaryPage.getConfirmDetailsButton().click();
      cy.get('.lbh-button').contains('Save and continue').click();
      cy.get('.lbh-button').contains('Save and continue').click();

      // get the first ethnicity radio button.
      Components.getRadioButtons().then((radioButtons) => {
        const randomIndex = Math.floor(Math.random() * radioButtons.length);
        radioButtons[randomIndex].click();
      });

      ApplyResidentSectionPage.getSubmitButton().click();

      // get the second ethnicity radio button.
      Components.getRadioButtons().then((radioButtons) => {
        const randomIndex = Math.floor(Math.random() * radioButtons.length);
        radioButtons[randomIndex].click();
      });

      ApplyResidentSectionPage.getSubmitButton().click();

      cy.get(`[data-testid="test-checkbox-declaration-0"]`).check();
      DeclarationPage.getSubmitButton().click();
    });
  });
});
