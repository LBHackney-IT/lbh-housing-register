import { faker } from '@faker-js/faker';

import { generateApplication } from '../../../testUtils/applicationHelper';
import { QuestionKey } from '../../../lib/utils/question-data';
import ReviewApplicantPage from '../../pages/reviewApplicant';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();

const application = generateApplication(applicationId, personId);

describe('Review applicant details', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.clearE2eNock();
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
  });

  it('shows the money section for read only users', () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getMoneySectionNavLink().should('be.visible');
  });

  it('shows the health section for read only users', () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getHealthSectionNavLink().should('be.visible');
  });

  it("doesn't show the view documents button for read only users", () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getViewDocumentsButton().should('not.exist');
  });
});

// Regression coverage for a production incident: form answers are persisted
// as JSON.stringify(value), so an unanswered question is stored as the
// *string* "null" - truthy, but re-parses to the JS value `null`. Several
// checkboxListData helpers then called a property/method directly on that
// parsed value (.toString(), .map(...), array[0].label) with no null guard,
// throwing an unhandled 500 and taking down the whole page for every field
// on it. See lib/utils/applicationQuestions.ts and lib/utils/checkboxListData.ts.
describe('Review applicant details - questions answered with the JSON literal "null"', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsUser('officer');
    cy.clearE2eNock();
  });

  it('shows N/A rather than throwing a 500 for a plain text question', () => {
    const brokenApplicationId = faker.string.uuid();
    const brokenPersonId = faker.string.uuid();
    const brokenApplication = generateApplication(
      brokenApplicationId,
      brokenPersonId,
    );
    brokenApplication.mainApplicant!.questions = [
      {
        id: QuestionKey.RESIDENTIAL_STATUS_RESIDENTIAL_STATUS,
        answer: 'null',
      },
    ];

    cy.mockHousingRegisterApiGetApplications(
      brokenApplicationId,
      brokenApplication,
    );
    ReviewApplicantPage.visit(brokenApplicationId, brokenPersonId);

    cy.contains('Review main applicant').should('be.visible');
    ReviewApplicantPage.getLivingSituationSectionNavLink().click();
    cy.contains('th', '3 year residential status')
      .siblings('td')
      .should('have.text', 'N/A');
  });

  it('renders no address history rows rather than throwing a 500', () => {
    const brokenApplicationId = faker.string.uuid();
    const brokenPersonId = faker.string.uuid();
    const brokenApplication = generateApplication(
      brokenApplicationId,
      brokenPersonId,
    );
    brokenApplication.mainApplicant!.questions = [
      { id: QuestionKey.ADDRESS_HISTORY, answer: 'null' },
    ];

    cy.mockHousingRegisterApiGetApplications(
      brokenApplicationId,
      brokenApplication,
    );
    ReviewApplicantPage.visit(brokenApplicationId, brokenPersonId);

    cy.contains('Review main applicant').should('be.visible');
    ReviewApplicantPage.getLivingSituationSectionNavLink().click();
    cy.contains('caption', 'Address History')
      .parent()
      .find('tbody tr')
      .should('have.length', 0);
  });

  it('renders no institutions text rather than throwing a 500', () => {
    const brokenApplicationId = faker.string.uuid();
    const brokenPersonId = faker.string.uuid();
    const brokenApplication = generateApplication(
      brokenApplicationId,
      brokenPersonId,
    );
    brokenApplication.mainApplicant!.questions = [
      { id: QuestionKey.RESIDENTIAL_STATUS_INSTITUTIONS, answer: 'null' },
    ];

    cy.mockHousingRegisterApiGetApplications(
      brokenApplicationId,
      brokenApplication,
    );
    ReviewApplicantPage.visit(brokenApplicationId, brokenPersonId);

    cy.contains('Review main applicant').should('be.visible');
    ReviewApplicantPage.getLivingSituationSectionNavLink().click();
    cy.contains(
      'th',
      'Applicant has been staying at the following institutions for the last 3 years',
    )
      .siblings('td')
      .should('have.text', 'N/A');
  });

  it('shows N/A for ethnicity rather than throwing a 500 when the extended category is unanswered', () => {
    const brokenApplicationId = faker.string.uuid();
    const brokenPersonId = faker.string.uuid();
    const brokenApplication = generateApplication(
      brokenApplicationId,
      brokenPersonId,
    );
    brokenApplication.mainApplicant!.questions = [
      { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
      { id: 'ethnicity-extended-category-asian', answer: 'null' },
    ];

    cy.mockHousingRegisterApiGetApplications(
      brokenApplicationId,
      brokenApplication,
    );
    ReviewApplicantPage.visit(brokenApplicationId, brokenPersonId);

    cy.contains('th', 'Ethnicity').siblings('td').should('have.text', 'N/A');
  });
});
