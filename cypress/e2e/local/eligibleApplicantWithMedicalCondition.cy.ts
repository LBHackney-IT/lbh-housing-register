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
import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';
import DeclarationPage from '../../pages/declaration';
import {
  addressSearchAPIResponse,
  answerYourSituationSectionWithNoToAll,
  fillInTheSignUpForm,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';
import { interceptAddressSearchAPI } from '../../support/intercepts';

//ensure age doesn't automatically make applicant eligible
const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 40 });

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

describe('Applicant with medical condition', () => {
  beforeEach(() => {
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    cy.clearAllCookies();
  });

  Cypress._.times(1, () => {
    it(`makes application eligible when applicant has a medical condition`, () => {
      const applicationId = faker.string.uuid();
      cy.loginAsResident(applicationId, false, false);
      const email = generateEmailAddress();

      visitHomepageSignInAndVerify(applicationId, email);
      fillInTheSignUpForm(signUpDetails);
      StartPage.getSubmitButton().click();

      //agree terms
      AgreeTermsPage.getAgreeCheckbox().check();
      AgreeTermsPage.getAgreeButton().click();

      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('There is 1 person in this application.');

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);

      //household index
      ApplyHouseholdPage.getContinueToNextStepLink().click();
      cy.contains('apply for a 1 bedroom property');

      //expect
      ApplyExpectPage.getContinueToNextStepButton().click();
      cy.contains("You've completed information for 0 of 1 people.");

      //apply overview/ fill in main applicant details
      cy.get('.lbh-applicant-summary__name')
        .contains(`${mainApplicantFirstName} ${mainApplicantLastName}`)
        .click();

      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);

      ////main applicant details
      ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
      ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
      ApplyResidentPersonalDetailsPage.getSubmitButton()
        .scrollIntoView()
        .click();

      ApplyResidentIndexPage.getImmigrationStatusSectionLink().click();
      ApplyResidentSectionPage.getImmigrationStatusRadioButton(0).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //has medical needs
      cy.get('.lbh-link').contains('Medical needs').click();
      cy.get(`[data-testid="test-radio-medical-needs.0"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //residential status
      cy.get('.lbh-link').contains('Residential status').click();
      cy.get(`[data-testid="test-radio-residential-status.0"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();

      //address history
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

      ApplyResidentIndexPage.getYourSituationSectionLink().click();
      answerYourSituationSectionWithNoToAll();

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
      cy.contains("You've completed information for 1 of 1 people.");

      cy.get('.lbh-button').contains('Save and continue').click();
      cy.get('.lbh-button').contains('Save and continue').click();

      cy.get(`[data-testid="test-radio-ethnicity-main-category.0"]`).check();
      ApplyResidentSectionPage.getSubmitButton().click();
      cy.get(`[data-testid="test-checkbox-declaration-0"]`).check();
      DeclarationPage.getSubmitButton().click();
      cy.contains('Application complete');
    });
  });
});
