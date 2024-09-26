import { HackneyGoogleUserWithPermissions } from 'lib/utils/googleAuth';

declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      loginAsUser(userType: string): Chainable<void>;
      loginAsResident(
        applicationId: string,
        setSeenCookieMessage?: boolean
      ): Chainable<void>;
      mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo(
        user: HackneyGoogleUserWithPermissions
      ): Chainable<void>;
      mockActivityHistoryApiEmptyResponse(targetId: string): Chainable<void>;
      mockHousingRegisterApiPostSearchResults(
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiGetApplications(
        applicationId: string,
        application: Application,
        persist?: boolean,
        delay?: number
      ): Chainable<void>;
      mount: typeof mount;
      mockHousingRegisterApiPatchApplication(
        applicationId: string,
        body?: Application,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;
    }
  }
}

export {};
