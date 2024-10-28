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
import ApplyResidentIndexPage from '../../pages/apply/[resident]';
import ApplyResidentPersonalDetailsPage from '../../pages/apply/[resident]/personal-details';
import ApplyResidentSectionPage from '../../pages/apply/[resident]/[section]';
import ApplyResidentAddressHistoryPage from '../../pages/apply/[resident]/address-history';
import ApplyResidentCurrentAccommodationPage from '../../pages/apply/[resident]/current-accommodation';
import ApplyResidentYourSituationPage from '../../pages/apply/[resident]/your-situation';
import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';
import DeclarationPage from '../../pages/declaration';
import AddPersonPage from '../../pages/addPerson';

//ensure eligibility: both over 55
const birthDate = faker.date.birthdate({ mode: 'age', min: 56, max: 90 });
const householdMemberBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 56,
  max: 90,
});

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

const householdMemberFirstName = faker.person.firstName();
const householdMemberLastName = faker.person.lastName();

const fillInTheSignUpForm = () => {
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

const fillInHouseholdMemberForm = (
  firstName: string,
  lastName: string,
  relationship: string,
  memberBirthday: Date
) => {
  AddPersonPage.getTitleDropdown().select(faker.helpers.enumValue(TitleEnum));
  AddPersonPage.getFirstNameInput().type(firstName);
  AddPersonPage.getLastNameInput().type(lastName);
  AddPersonPage.getRelationshipDropdown().select(relationship);
  AddPersonPage.getDoBDayInput().type(memberBirthday.getDate().toString());
  AddPersonPage.getDoBMonthInput().type(
    (memberBirthday.getMonth() + 1).toString()
  );
  AddPersonPage.getDoBYearInput().type(memberBirthday.getFullYear().toString());
  AddPersonPage.getGenderDropdown().check('M');
};

const addressSearchAPIResponse = {
  body: {
    address: [
      {
        line1: 'TEST ADDRESS',
        line2: '1 STREET',
        line3: 'LOCAL',
        line4: '',
        town: 'CITY',
        postcode: `${postcode}`,
        UPRN: 11111111111,
      },
    ],
    page_count: 1,
    total_count: 1,
  },
};

describe('Applicant and household member both over 55', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it(`makes application eligible when both main applicant and household member are over 55`, () => {
    cy.intercept(
      {
        method: 'GET',
        path: '/api/address/*',
      },
      addressSearchAPIResponse
    ).as('addressSearchMock');

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

    fillInTheSignUpForm();
    StartPage.getSubmitButton().click();

    //agree terms
    AgreeTermsPage.getAgreeCheckbox().check();
    AgreeTermsPage.getAgreeButton().click();

    cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
    cy.contains('There is 1 person in this application.');

    //add household member (partner)
    ApplyHouseholdPage.getAddHouseholdMemberButton().click();
    fillInHouseholdMemberForm(
      householdMemberFirstName,
      householdMemberLastName,
      'partner',
      householdMemberBirthDate
    );
    AddPersonPage.getSubmitButton().click();

    cy.contains('Person 1: Me');
    cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
    cy.contains('Person 2: My partner');
    cy.contains(`${householdMemberFirstName} ${householdMemberLastName}`);
    cy.contains('There are 2 people in this application.');

    //household index
    ApplyHouseholdPage.getContinueToNextStepLink().click();
    cy.contains('apply for a 1 bedroom property');

    //expect
    ApplyExpectPage.getContinueToNextStepButton().click();
    cy.contains("You've completed information for 0 of 2 people.");

    //apply overview/ fill in main applicant details
    cy.get('.lbh-applicant-summary__name')
      .contains(`${mainApplicantFirstName} ${mainApplicantLastName}`)
      .click();

    cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);

    ////main applicant details
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
    cy.contains("You've completed information for 1 of 2 people.");

    ////partner
    cy.get('.lbh-applicant-summary__name')
      .contains(`${householdMemberFirstName} ${householdMemberLastName}`)
      .click();

    cy.contains(`${householdMemberFirstName} ${householdMemberLastName}`);

    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getNINumberInput().type(
      faker.string.alphanumeric(9)
    );
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();

    ApplyResidentIndexPage.getImmigrationStatusSectionLink().click();
    ApplyResidentSectionPage.getImmigrationStatusRadioButton(0).check();
    ApplyResidentSectionPage.getSubmitButton().click();

    //medical needs
    cy.get('.lbh-link').contains('Medical needs').click();
    cy.get(`[data-testid="test-radio-medical-needs.1"]`).check();
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

    //employment
    cy.get('.lbh-link').contains('Employment').click();
    //unemployed
    cy.get(`[data-testid="test-radio-employment.3"]`).check();
    ApplyResidentSectionPage.getSubmitButton().click();

    //confirm details
    ApplyResidentIndexPage.getCheckAnswersButton().click();
    ApplyResidentSummaryPage.getConfirmDetailsButton().click();
    cy.contains("You've completed information for 2 of 2 people.");

    cy.get('.lbh-button').contains('Save and continue').click();
    cy.get('.lbh-button').contains('Save and continue').click();

    cy.get(`[data-testid="test-radio-ethnicity-main-category.0"]`).check();
    ApplyResidentSectionPage.getSubmitButton().click();
    cy.get(`[data-testid="test-checkbox-declaration-0"]`).check();
    DeclarationPage.getSubmitButton().click();
    cy.contains('Application complete');
  });
});
