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
import AddPersonPage from '../../pages/addPerson';

//ensure eligibility: over 55 and alone
const birthDate = faker.date.birthdate({ mode: 'age', min: 56, max: 90 });
const childBirthDate = faker.date.birthdate({ mode: 'age', min: 1, max: 17 });
const secondChildBirthDate = faker.date.birthdate({
  mode: 'age',
  min: 1,
  max: 17,
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

const householdMemberOneFirstName = faker.person.firstName();
const householdMemberOneLastName = faker.person.lastName();
const householdMemberTwoFirstName = faker.person.firstName();
const householdMemberTwoLastName = faker.person.lastName();
const householdMemberThreeFirstName = faker.person.firstName();
const householdMemberThreeLastName = faker.person.lastName();

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

Cypress._.times(1, () => {
  describe('Add and remove household members', () => {
    beforeEach(() => {
      cy.clearAllCookies();
    });

    it(`allows user to add and remove household members`, () => {
      //intercept address API since address is not relevant in this test
      cy.intercept(
        {
          method: 'GET',
          path: '/api/address/*',
        },
        addressSearchAPIResponse
      ).as('addressSearchMock');

      cy.viewport(1000, 1000);

      HomePage.visit(applicationId);
      HomePage.getCookiesButton().click();

      HomePage.getStartApplicationButton().scrollIntoView().click();

      SignInPage.getEmailInput()
        .scrollIntoView()
        .type(`${email}`, { delay: 0 });

      SignInPage.getSubmitButton().click();

      //need to login like this since Cypress doesn't seem to be handling the cookie set by the app
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
        householdMemberOneFirstName,
        householdMemberOneLastName,
        'partner',
        birthDate
      );
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(
        `${householdMemberOneFirstName} ${householdMemberOneLastName}`
      );
      cy.contains('There are 2 people in this application.');

      //add household member (child)
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(
        householdMemberTwoFirstName,
        householdMemberTwoLastName,
        'child',
        childBirthDate
      );
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(
        `${householdMemberOneFirstName} ${householdMemberOneLastName}`
      );
      cy.contains('Person 3: My child');
      cy.contains(
        `${householdMemberTwoFirstName} ${householdMemberTwoLastName}`
      );
      cy.contains('There are 3 people in this application.');

      //add household member (second child)
      ApplyHouseholdPage.getAddHouseholdMemberButton().click();
      fillInHouseholdMemberForm(
        householdMemberThreeFirstName,
        householdMemberThreeLastName,
        'child',
        secondChildBirthDate
      );
      AddPersonPage.getSubmitButton().click();

      cy.contains('Person 1: Me');
      cy.contains(`${mainApplicantFirstName} ${mainApplicantLastName}`);
      cy.contains('Person 2: My partner');
      cy.contains(
        `${householdMemberOneFirstName} ${householdMemberOneLastName}`
      );
      cy.contains('Person 3: My child');
      cy.contains(
        `${householdMemberTwoFirstName} ${householdMemberTwoLastName}`
      );
      cy.contains('Person 4: My child');
      cy.contains(
        `${householdMemberThreeFirstName} ${householdMemberThreeLastName}`
      );
      cy.contains('There are 4 people in this application.');
    });
  });
});
