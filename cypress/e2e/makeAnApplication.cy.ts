import { faker } from '@faker-js/faker/locale/en_GB';

import ApplyPage from '../pages/apply';
import HomePage from '../pages/home';
import SignInPage from '../pages/signIn';
import StartPage from '../pages/start';
import { screenPresets } from '../support/helpers';
import {
  interceptApplicatonApi,
  interceptAuthApi,
} from '../support/intercepts';

describe('Housing application', () => {
  screenPresets.forEach((screenPreset) => {
    it(`user successfully submits an application on ${screenPreset}`, () => {
      cy.viewport(screenPreset);
      cy.clearCookies();

      HomePage.visit();
      // accept cookies
      HomePage.getCookiesButton().click();

      // start application
      HomePage.getStartApplicationButton().scrollIntoView().click();

      // give an email address for verification code
      const generateEmailAddress = faker.internet.email({
        provider: 'hackneyTEST.gov.uk',
      });
      SignInPage.getEmailInput().scrollIntoView().type(generateEmailAddress);

      interceptAuthApi('generate');
      SignInPage.getSubmitButton().scrollIntoView().click();

      cy.get('button[type="submit"]').click();

      // confirmation verification code has been sent

      ApplyPage.getVerifyCodePage().should('be.visible');
      const generateCode = faker.number
        .int({ min: 100000, max: 999999 })
        .toString();

      ApplyPage.getVerifyCodeInput().scrollIntoView().type(generateCode);

      interceptAuthApi('verify');
      interceptApplicatonApi();

      ApplyPage.getVerifySubmitButton().scrollIntoView().click();

      // application has been started

      StartPage.getStartApplicationPage().should('be.visible');
    });
  });
});
