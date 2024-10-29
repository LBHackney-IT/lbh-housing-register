import { faker } from '@faker-js/faker/locale/en_GB';
import StartPage from '../../pages/start';
import {
  generateEmailAddress,
  TitleEnum,
} from '../../../testUtils/personHelper';
import AgreeTermsPage from '../../pages/agreeTerms';
import ApplyHouseholdPage from '../../pages/household';
import ApplyExpectPage from '../../pages/apply/expect';
import RejectionPage from '../../pages/rejection';

import ApplyResidentSummaryPage from '../../pages/apply/[resident]/summary';
import { getDisqualificationReasonOption } from '../../../lib/utils/disqualificationReasonOptions';
import { interceptAddressSearchAPI } from '../../support/intercepts';
import {
  addressSearchAPIResponse,
  fillInTheSignUpForm,
  SignUpFormDetails,
  visitHomepageSignInAndVerify,
} from '../../support/locale2eTestsHelper';

// user is under 18
const birthDate = faker.date.birthdate({ mode: 'age', min: 15, max: 17 });
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

describe('Ineligible main applicant', () => {
  beforeEach(() => {
    interceptAddressSearchAPI(addressSearchAPIResponse(postcode));
    cy.clearAllCookies();
  });

  Cypress._.times(1, () => {
    it(`rejects an applicant under the age of 18`, () => {
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

      ApplyResidentSummaryPage.getConfirmDetailsButton().click();

      RejectionPage.getRejectionPage().should('be.visible');

      RejectionPage.getRejectionReason().should(
        'contain.text',
        getDisqualificationReasonOption('under18YearsOld')
      );
    });
  });
