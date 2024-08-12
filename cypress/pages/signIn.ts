class SignInPage {
  static getSignInPage() {
    const testId = 'test-sign-in-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getEmailInput() {
    return this.getSignInPage().find('input[name="emailAddress"]');
  }

  static getSubmitButton() {
    return this.getSignInPage().find('button[type="submit"]');
  }
}
export default SignInPage;
