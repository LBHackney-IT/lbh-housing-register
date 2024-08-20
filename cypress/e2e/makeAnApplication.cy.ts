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
    it(`user successfully verifies and starts application on ${screenPreset}`, () => {
      cy.viewport(screenPreset);
      cy.clearCookies();

      HomePage.visit();

      HomePage.getCookiesButton().click();

      HomePage.getStartApplicationButton().scrollIntoView().click();

      const generateEmailAddress = faker.internet.email({
        provider: 'hackneyTEST.gov.uk',
      });
      SignInPage.getEmailInput().scrollIntoView().type(generateEmailAddress);

      interceptAuthApi('generate');
      SignInPage.getSubmitButton().scrollIntoView().click();

      cy.get('button[type="submit"]').click();

      ApplyPage.getVerifyCodePage().should('be.visible');
      const generateCode = faker.number
        .int({ min: 100000, max: 999999 })
        .toString();

      ApplyPage.getVerifyCodeInput().scrollIntoView().type(generateCode);

      interceptAuthApi('verify');
      interceptApplicatonApi();

      ApplyPage.getVerifySubmitButton().scrollIntoView().click();

      StartPage.getStartApplicationPage().should('be.visible');
    });
  });
});
