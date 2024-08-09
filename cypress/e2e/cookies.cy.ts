/// <reference types="cypress" />

import HomePage from '../pages/home';
import { screenPresets } from '../support/helpers';

context('Cookies', () => {
  it('selects accept cookies button', () => {
    screenPresets.forEach((screenPreset) => {
      cy.viewport(screenPreset);

      Cypress.Cookies.debug(true);
      HomePage.visit();
      // clear cookies again after visiting to remove
      // any 3rd party cookies picked up such as cloudflare
      cy.clearCookies();

      HomePage.getCookiesButton().scrollIntoView();
      HomePage.getCookiesBanner().should('be.visible');

      HomePage.getCookiesButton().click();
      HomePage.getCookiesBanner().should('not.be.visible');
      cy.getCookie('seen_cookie_message').should('exist');
      cy.getCookie('seen_cookie_message').should(
        'have.property',
        'value',
        'true'
      );
    });
  });
});
