// Given that I am a user I can make a new application

import ApplyPage from '../pages/apply';
import HomePage from '../pages/home';
import { intercept_verify_api } from '../support/intercepts';

describe('User makes a housing application', () => {
  it('allows a user to submit an application', () => {
    // screenPresets.forEach((screenPreset) => {
    // cy.viewport(screenPreset);
    cy.clearCookies();

    HomePage.visit();
    // accept cookies
    HomePage.getCookiesButton().click();

    // start application
    HomePage.getStartApplicationButton().scrollIntoView();
    HomePage.getStartApplicationButton().click();

    // give an email address for verification code
    cy.get('input[name="emailAddress"]').type('test@example.com');
    intercept_verify_api();
    cy.get('button[type="submit"]').click();

    // confirmation verification code has been sent

    ApplyPage.getVerifyCodePage().should('be.visible');
    cy.get('input[name="code"]').type('im the boss');
    // cy.get('button[type="continue"]').click();
  });
});
