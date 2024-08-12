import HomePage from '../pages/home';
import { screenPresets } from '../support/helpers';

context('Cookies', () => {
  it('selects accept cookies button', () => {
    screenPresets.forEach((screenPreset) => {
      cy.viewport(screenPreset);

      Cypress.Cookies.debug(true);
      HomePage.visit();

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
