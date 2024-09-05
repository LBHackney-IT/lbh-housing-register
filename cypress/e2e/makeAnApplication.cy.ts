import { faker } from '@faker-js/faker/locale/en_GB';

import ApplyPage from '../pages/apply';
import HomePage from '../pages/home';
import SignInPage from '../pages/signIn';
import StartPage from '../pages/start';
import {
  interceptApplicatonApi,
  interceptAuthApi,
} from '../support/intercepts';

describe('Housing application', () => {
  it(`user successfully verifies and starts application`, () => {
    const generateEmailAddress = faker.internet.email({
      provider: 'hackneyTEST.gov.uk',
    });
    const generateCode = faker.number
      .int({ min: 100000, max: 999999 })
      .toString();

    cy.clearCookies();

    HomePage.visit();
    HomePage.getCookiesButton().click();
    HomePage.getStartApplicationButton().scrollIntoView().click();
    SignInPage.getEmailInput().scrollIntoView().type(generateEmailAddress);

    interceptAuthApi('generate');

    SignInPage.getSubmitButton().scrollIntoView().click();
    cy.get('button[type="submit"]').click();
    ApplyPage.getVerifyCodePage().should('be.visible');
    ApplyPage.getVerifyCodeInput().scrollIntoView().type(generateCode);

    interceptAuthApi('verify');
    interceptApplicatonApi();

    ApplyPage.getVerifySubmitButton().scrollIntoView().click();
    StartPage.getStartApplicationPage().should('be.visible');
  });
});
