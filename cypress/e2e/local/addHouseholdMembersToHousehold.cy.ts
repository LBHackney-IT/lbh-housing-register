import { faker } from '@faker-js/faker/locale/en_GB';
import StartPage from '../../pages/start';
import {
  generateEmailAddress,
  TitleEnum,
} from '../../../testUtils/personHelper';
import AgreeTermsPage from '../../pages/agreeTerms';
import ApplyHouseholdPage from '../../pages/household';
import AddPersonPage from '../../pages/addPerson';
import {
  addressSearchAPIResponse,
  fillInHouseholdMemberForm,
  fillInTheSignUpForm,
  HouseholdMemberDetails,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';
import { interceptAddressSearchAPI } from '../../support/intercepts';

const title = faker.helpers.enumValue(TitleEnum);
const phoneNumber = faker.phone.number();
const postcode = 'A1 2BC';

const mainApplicantBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 56,
  max: 90,
});
const childOneBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 1,
  max: 17,
});
const childTwoBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 1,
  max: 17,
});

const mainApplicantFirstName = faker.person.firstName();
const mainApplicantLastName = faker.person.lastName();
const mainApplicantGender = 'M';
const mainApplicantNINumber = faker.string.alphanumeric(9);

const partnerFirstName = faker.person.firstName();
const partnerLastName = faker.person.lastName();
const childOneFirstName = faker.person.firstName();
const childOneLastName = faker.person.lastName();
const childTwoFirstName = faker.person.firstName();
const childTwoLastName = faker.person.lastName();

const signUpDetails: SignUpFormDetails = {
  title,
  firstName: mainApplicantFirstName,
  lastName: mainApplicantLastName,
  birthDate: mainApplicantBirthDate,
  gender: mainApplicantGender,
  nationalInsuranceNumber: mainApplicantNINumber,
  phoneNumber,
};

const partnerDetails: HouseholdMemberDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: partnerFirstName,
  lastName: partnerLastName,
  relationship: 'partner',
  birthday: mainApplicantBirthDate,
  gender: 'M',
};

const childOneDetails: HouseholdMemberDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: childOneFirstName,
  lastName: childOneLastName,
  relationship: 'child',
  birthday: childOneBirthDate,
  gender: 'M',
};

const childTwoDetails: HouseholdMemberDetails = {
  title: faker.helpers.enumValue(TitleEnum),
  firstName: childTwoFirstName,
  lastName: childTwoLastName,
  relationship: 'child',
  birthday: childTwoBirthDate,
  gender: 'F',
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

      //add partner
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();

      fillInHouseholdMemberForm(partnerDetails);
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(`${partnerFirstName} ${partnerLastName}`);
      cy.contains('There are 2 people in this application.');

      //add first child
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(childOneDetails);
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(`${partnerFirstName} ${partnerLastName}`);
      cy.contains('Person 3: My child');
      cy.contains(`${childOneFirstName} ${childOneLastName}`);
      cy.contains('There are 3 people in this application.');

      //add second child
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(childTwoDetails);
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(`${partnerFirstName} ${partnerLastName}`);
      cy.contains('Person 3: My child');
      cy.contains(`${childOneFirstName} ${childOneLastName}`);
      cy.contains('Person 4: My child');
      cy.contains(`${childTwoFirstName} ${childTwoLastName}`);
      cy.contains('There are 4 people in this application.');

      cy.contains('Sign out').click();
    });
  });
});
