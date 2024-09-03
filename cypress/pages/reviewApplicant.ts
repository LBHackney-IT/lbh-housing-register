class ReviewApplicantPage {
  static visit() {
    const applicationId = 'a8724d4f-e0ed-4cf0-a898-a10d96f2a475'; //faker.string.uuid();
    const personId = '497e44cc-6614-4380-a331-75763ae6dd29'; //faker.string.uuid();
    cy.visit(`applications/view/${applicationId}/${personId}`);
  }

  static getMoneySectionNavLink() {
    const testId = 'test-applicant-money-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }

  static getHealthSectionNavLink() {
    const testId = 'test-applicant-health-section-navigation';
    return cy.get(`[data-testid="${testId}"]`);
  }
}

export default ReviewApplicantPage;
