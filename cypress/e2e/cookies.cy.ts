import HomePage from '../pages/home';

context('Cookies', () => {
  it('user successfully selects accept cookies button', () => {
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
