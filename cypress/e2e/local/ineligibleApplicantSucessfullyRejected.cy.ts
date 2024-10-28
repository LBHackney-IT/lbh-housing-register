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

import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';

// user is under 18
const birthDate = faker.date.birthdate({ mode: 'age', min: 15, max: 17 });
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
  describe('Ineligible main applicant', () => {
    beforeEach(() => {
      cy.clearAllCookies();
    });

    it(`rejects an applicant under the age of 18`, () => {
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

      cy.loginAsResident(applicationId, true, true);

      VerifyPage.getVerifyCodePage().should('be.visible');
      VerifyPage.getVerifyCodeInput()
        .scrollIntoView()
        .type(verificationCode, { delay: 0 });
      VerifyPage.getVerifySubmitButton().scrollIntoView().click();

      fillInTheSignUpForm();
      StartPage.getSubmitButton().click();

      AgreeTermsPage.getAgreeCheckbox().check();
      AgreeTermsPage.getAgreeButton().click();

      ApplyHouseholdPage.getContinueToNextStepLink().click();

      ApplyExpectPage.getContinueToNextStepButton().click();

      cy.get('.lbh-applicant-summary__name')
        .contains(`${mainApplicantFirstName} ${mainApplicantLastName}`)
        .click();

      ApplyResidentSummaryPage.getConfirmDetailsButton().click();

      RejectionPage.getRejectionPage().should('be.visible');
    });
  });
});
