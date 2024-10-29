import { faker } from '@faker-js/faker/locale/en_GB';
import StartPage from '../../pages/start';
import {
  generateEmailAddress,
  getRandomGender,
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
import { interceptAddressSearchAPI } from '../../support/intercepts';
import {
  addressSearchAPIResponse,
  fillInTheSignUpForm,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';

//ensure eligibility: over 55 and alone
const birthDate = faker.date.birthdate({ mode: 'age', min: 56, max: 90 });
const title = faker.helpers.enumValue(TitleEnum);
const phoneNumber = faker.phone.number();
const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();
const postcode = 'A1 2AB';
const email = generateEmailAddress();
const applicationId = faker.string.uuid();
const gender = getRandomGender();
const niNumber = faker.string.alphanumeric(9);

const signUpDetails: SignUpFormDetails = {
  title,
  firstName: mainApplicantFirstName,
  lastName: mainApplicantLastName,
  birthDate,
  gender,
  nationalInsuranceNumber: niNumber,
  phoneNumber,
};

describe('Single main applicant, over 55', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    //need to login like this since Cypress doesn't seem to be handling the cookie set by the app
    cy.loginAsResident(applicationId, false, false);
  });

  it(`allows eligible applicant to fill in and submit the application`, () => {
    visitHomepageSignInAndVerify(applicationId, email);
    fillInTheSignUpForm(signUpDetails);
    StartPage.getSubmitButton().click();

    //agree terms
    AgreeTermsPage.getAgreeCheckbox().check();
    AgreeTermsPage.getAgreeButton().click();

    cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
    cy.contains('There is 1 person in this application.');

    //household index
    ApplyHouseholdPage.getContinueToNextStepLink().click();
    cy.contains('apply for a 1 bedroom property');

    //expect
    ApplyExpectPage.getContinueToNextStepButton().click();
    cy.contains("You've completed information for 0 of 1 people.");

    //apply overview/ fill in main applicant details
    //we have no means of retrieving the person id in these tests at the moment, so have to use their name to get the correct link
    cy.get('.lbh-applicant-summary__name')
      .contains(`${mainApplicantFirstName} ${mainApplicantLastName}`)
      .click();

    cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);

    //main applicant details
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();

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
    ApplyResidentYourSituationPage.getServedInArmedForcesRadioButton(1).check();
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
    ApplyResidentYourSituationPage.getUnspentConvictionsRadioButton(1).check();
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