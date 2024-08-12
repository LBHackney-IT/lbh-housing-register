class ApplyPage {
  static getVerifyCodePage() {
    const testId = 'test-verify-code-page';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getVerifyCodeInput() {
    return this.getVerifyCodePage().find('input[name="code"]');
  }

  static getVerifySubmitButton() {
    return this.getVerifyCodePage().find('button[type="submit"]');
  }
}
export default ApplyPage;
