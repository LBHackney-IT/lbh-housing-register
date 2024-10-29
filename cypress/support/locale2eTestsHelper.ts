import { faker } from '@faker-js/faker';
import HomePage from '../pages/home';
import SignInPage from '../pages/signIn';
import VerifyPage from '../pages/verify';
import StartPage from '../pages/start';
import AddPersonPage from '../pages/addPerson';
import ApplyResidentYourSituationPage from '../pages/apply/[resident]/your-situation';

interface AddressApiRecord {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  town: string;
  postcode: string;
  UPRN: number;
}

export interface AddressApiResponse {
  body: {
    address: Array<AddressApiRecord>;
    page_count: number;
    total_count: number;
  };
}

export const addressSearchAPIResponse = (
  postCode: string
): AddressApiResponse => {
  return {
    body: {
      address: [
        {
          line1: 'TEST ADDRESS',
          line2: '1 STREET',
          line3: 'LOCAL',
          line4: '',
          town: 'CITY',
          postcode: postCode,
          UPRN: 11111111111,
        },
      ],
      page_count: 1,
      total_count: 1,
    },
  };
};

export const visitHomepageSignInAndVerify = (
  applicationId: string,
  email: string
) => {
  const verificationCode = faker.number
    .int({ min: 100000, max: 999999 })
    .toString();

  HomePage.visit(applicationId);
  HomePage.getCookiesButton().click();

  HomePage.getStartApplicationButton().scrollIntoView().click();

  SignInPage.getEmailInput().scrollIntoView().type(`${email}`, { delay: 0 });

  SignInPage.getSubmitButton().click();

  VerifyPage.getVerifyCodePage().should('be.visible');
  VerifyPage.getVerifyCodeInput()
    .scrollIntoView()
    .type(verificationCode, { delay: 0 });
  VerifyPage.getVerifySubmitButton().scrollIntoView().click();
};

export interface SignUpFormDetails {
  title: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  nationalInsuranceNumber: string;
  phoneNumber: string;
}

export const fillInTheSignUpForm = (details: SignUpFormDetails) => {
  StartPage.getTitleDropdown().select(details.title);
  StartPage.getFirstNameInput().type(details.firstName);
  StartPage.getLastNameInput().type(details.lastName);
  StartPage.getDoBDayInput().type(details.birthDate.getDate().toString());
  StartPage.getDoBMonthInput().type(
    (details.birthDate.getMonth() + 1).toString()
  );
  StartPage.getDoBYearInput().type(details.birthDate.getFullYear().toString());
  StartPage.getGenderOptions().check(details.gender);
  StartPage.getNationalInsuranceNumberInput().type(
    details.nationalInsuranceNumber
  );
  StartPage.getPhoneNumberInput().type(details.phoneNumber);
};

export interface HouseholdMemberDetails {
  title: string;
  firstName: string;
  lastName: string;
  relationship: string;
  birthday: Date;
  gender: string;
}

export const fillInHouseholdMemberForm = (details: HouseholdMemberDetails) => {
  AddPersonPage.getTitleDropdown().select(details.title);
  AddPersonPage.getFirstNameInput().type(details.firstName);
  AddPersonPage.getLastNameInput().type(details.lastName);
  AddPersonPage.getRelationshipDropdown().select(details.relationship);
  AddPersonPage.getDoBDayInput().type(details.birthday.getDate().toString());
  AddPersonPage.getDoBMonthInput().type(
    (details.birthday.getMonth() + 1).toString()
  );
  AddPersonPage.getDoBYearInput().type(
    details.birthday.getFullYear().toString()
  );
  AddPersonPage.getGenderDropdown().check(details.gender);
};

export const answerYourSituationSectionWithNoToAll = () => {
  ApplyResidentYourSituationPage.getSubmitButton().click();
  ApplyResidentYourSituationPage.getServedInArmedForcesRadioButton(1).check();
  ApplyResidentYourSituationPage.getSubmitButton().click();
  ApplyResidentYourSituationPage.getIntentionallyHomelessRadioButton(1).check();
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
};
