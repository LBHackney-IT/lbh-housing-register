//import { Applicant } from 'domain/HousingApi';
import { HackneyGoogleUserWithPermissions } from 'lib/utils/googleAuth';

declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      loginAsUser(userType: string): Chainable<void>;
      loginAsResident(applicationId: string): Chainable<void>;
      mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo(
        user: HackneyGoogleUserWithPermissions
      ): Chainable<void>;
      mockActivityHistoryApiEmptyResponse(targetId: string): Chainable<void>;
      mockHousingRegisterApiPostSearchResults(
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiGetApplications(
        applicationId: string,
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiPostApplications(
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiGenerate(): Chainable<void>;
      mockHousingRegisterApiVerify(): Chainable<void>;
      mount: typeof mount;
    }
  }
}

export {};
