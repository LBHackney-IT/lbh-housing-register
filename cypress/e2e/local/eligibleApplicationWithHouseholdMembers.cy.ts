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
import AddPersonPage from '../../pages/addPerson';
import {
  addressSearchAPIResponse,
  answerYourSituationSectionWithNoToAll,
  fillInHouseholdMemberForm,
  fillInTheSignUpForm,
  HouseholdMemberDetails,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';
import { interceptAddressSearchAPI } from '../../support/intercepts';

const mainApplicantBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 18,
  max: 90,
});
const partnerBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 18,
  max: 90,
});
const childBirthDate = faker.date.birthdate({ mode: 'age', min: 1, max: 15 });
const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();

const phoneNumber = faker.phone.number();
const postcode = 'A1 2BC';

const partnerFirstName = faker.person.firstName();
const partnerLastName = faker.person.lastName();
const childFirstName = faker.person.firstName();
const childLastName = faker.person.lastName();

const signUpDetails: SignUpFormDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: mainApplicantFirstName,
  lastName: mainApplicantLastName,
  birthDate: mainApplicantBirthDate,
  gender: 'M',
  nationalInsuranceNumber: faker.string.alphanumeric(9),
  phoneNumber,
};

const partnerDetails: HouseholdMemberDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: partnerFirstName,
  lastName: partnerLastName,
  relationship: 'partner',
  birthday: partnerBirthDate,
  gender: 'M',
};

const childDetails: HouseholdMemberDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: childFirstName,
  lastName: childLastName,
  relationship: 'child',
  birthday: childBirthDate,
  gender: 'M',
};

describe('Add and remove household members', () => {
  beforeEach(() => {
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    cy.clearAllCookies();
  });

  Cypress._.times(1, () => {
    it(`allows user to add and remove household members`, () => {
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

      //add household member (partner)
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(partnerDetails);
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(`${partnerFirstName} ${partnerLastName}`);
      cy.contains('There are 2 people in this application.');

      //add household member (child)
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(childDetails);
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(`${partnerFirstName} ${partnerLastName}`);
      cy.contains('Person 3: My child');
      cy.contains(`${childFirstName} ${childLastName}`);
      cy.contains('There are 3 people in this application.');

      //household index
      ApplyHouseholdPage.getContinueToNextStepLink().click();
      cy.contains('apply for a 2 bedroom property');

      //expect
      ApplyExpectPage.getContinueToNextStepButton().click();
      cy.contains("You've completed information for 0 of 3 people.");

      //apply overview/ fill in main applicant details
      //we have no means of retrieving the person id in these tests at the moment, so have to use their name to get the correct link
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
      cy.contains("You've completed information for 1 of 3 people.");

      ////partner
      cy.get('.lbh-applicant-summary__name')
        .contains(`${partnerFirstName} ${[partnerLastName]}`)
        .click();

      cy.contains(`${partnerFirstName} ${partnerLastName}`);

      ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
      ApplyResidentPersonalDetailsPage.getNINumberInput().type(
        faker.string.alphanumeric(9)
      );
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
      cy.contains("You've completed information for 2 of 3 people.");

      ////child
      cy.get('.lbh-applicant-summary__name')
        .contains(`${childFirstName} ${childLastName}`)
        .click();

      cy.contains(`${childFirstName} ${childLastName}`);

      ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
      ApplyResidentPersonalDetailsPage.getSubmitButton()
        .scrollIntoView()
        .click();

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

      //confirm details
      ApplyResidentIndexPage.getCheckAnswersButton().click();
      ApplyResidentSummaryPage.getConfirmDetailsButton().click();
      cy.contains("You've completed information for 3 of 3 people.");

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
