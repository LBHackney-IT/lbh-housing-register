import { faker } from '@faker-js/faker/locale/en_GB';
import HomePage from '../../pages/home';
import SignInPage from '../../pages/signIn';
import VerifyPage from '../../pages/verify';
import StartPage from '../../pages/start';
import {
  generateEmailAddress,
  getRandomGender,
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

const title = faker.helpers.enumValue(TitleEnum);
const phoneNumber = faker.phone.number();
const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();
const postcode = 'A1 2BC';
const email = generateEmailAddress();
const applicationId = faker.string.uuid();
const verificationCode = faker.number
  .int({ min: 100000, max: 999999 })
  .toString();

const fillInTheSignUpForm = (birthDate: Date) => {
  StartPage.getTitleDropdown().select(title);
  StartPage.getFirstNameInput().type(mainApplicantFirstName);
  StartPage.getLastNameInput().type(mainApplicantLastName);
  StartPage.getDoBDayInput().type(birthDate.getDate().toString());
  StartPage.getDoBMonthInput().type((birthDate.getMonth() + 1).toString());
  StartPage.getDoBYearInput().type(birthDate.getFullYear().toString());
  StartPage.getGenderOptions().check(getRandomGender());
  StartPage.getNationalInsuranceNumberInput().type(
    faker.string.alphanumeric(9)
  );
  StartPage.getPhoneNumberInput().type(phoneNumber);
};

describe('Ineligible main applicant', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });
  it(`rejects an applicant who is defined as not lacking rooms`, () => {
    const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 54 });
    cy.mockAddressAPISearchByPostcode(postcode);

    cy.viewport(1000, 1000);

    HomePage.visit(applicationId);
    HomePage.getCookiesButton().click();

    HomePage.getStartApplicationButton().scrollIntoView().click();

    SignInPage.getEmailInput().scrollIntoView().type(`${email}`, { delay: 0 });

    SignInPage.getSubmitButton().click();

    cy.loginAsResident(applicationId, true, true);

    VerifyPage.getVerifyCodePage().should('be.visible');
    VerifyPage.getVerifyCodeInput()
      .scrollIntoView()
      .type(verificationCode, { delay: 0 });
    VerifyPage.getVerifySubmitButton().scrollIntoView().click();

    fillInTheSignUpForm(birthDate);
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
    // Applicant shares with 0 people
    ApplyResidentCurrentAccommodationPage.getShareInput().type('0', {
      delay: 0,
    });
    // Accomodation has 3 bedrooms
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
