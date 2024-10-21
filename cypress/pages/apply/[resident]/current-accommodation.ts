class ApplyResidentCurrentAccommodationPage {
  static getRadioButton() {
    return cy.get('[type="radio"]');
  }

  static getSaveAndContinueButton() {
    const testId = 'test-submit-form-button';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getDescribeHomeRadioButton(index: number) {
    const testId = `test-radio-home.${index}`;
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getFloorInput() {
    return cy.get('#home-floor');
  }

  static getShareInput() {
    return cy.get('#home-how-many-people-share');
  }

  static getBedroomsInput() {
    return cy.get('#home-how-many-bedrooms');
  }

  static getLivingRoomsInput() {
    return cy.get('#home-how-many-livingrooms');
  }

  static getDiningRoomsInput() {
    return cy.get('#home-how-many-diningrooms');
  }

  static getBathRoomsInput() {
    return cy.get('#home-how-many-bathrooms');
  }

  static getKitchensInput() {
    return cy.get('#home-how-many-kitchens');
  }

  static getOtherRoomsInput() {
    return cy.get('#home-how-many-other-rooms');
  }

  static getUnsuitableHomeReasonInput() {
    return cy.get('#why-home-unsuitable');
  }

  static getLandlordNameInput() {
    return cy.get('#landlord-name');
  }
}

export default ApplyResidentCurrentAccommodationPage;
