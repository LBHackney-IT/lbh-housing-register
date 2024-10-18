import { ActivityHistoryResponse } from 'domain/ActivityHistoryApi';
import { HackneyGoogleUserWithPermissions } from 'lib/utils/googleAuth';

declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      loginAsUser(userType: string): Chainable<void>;
      loginAsResident(
        applicationId: string,
        setSeenCookieMessage?: boolean,
        seenCookieMessageAlreadySet?: boolean
      ): Chainable<void>;
      mockHousingRegisterApiGetApplicationsByStatusAndAssignedTo(
        user: HackneyGoogleUserWithPermissions
      ): Chainable<void>;
      mockActivityHistoryApiEmptyResponse(
        targetId: string,
        results?: ActivityHistoryResponse,
        persist?: boolean
      ): Chainable<void>;
      mockHousingRegisterApiPostSearchResults(
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiGetApplications(
        applicationId: string,
        application: Application,
        persist?: boolean,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;
      mockHousingRegisterApiPatchApplication(
        applicationId: string,
        body?: Application,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;
      mockHousingRegisterApiCompleteApplication(
        applicationId: string,
        body?: Application,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;
      mockHousingRegisterApiPostApplication(
        body?: Application,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;
      mockHousingRegisterApiPostGenerateToken(
        delay?: number,
        persist?: boolean,
        statusCode?: number
      ): Chainable<void>;
      mockHousingRegisterApiPostVerifyToken(
        applicationId: string,
        delay?: number,
        statusCode?: number
      ): Chainable<void>;

      mount: typeof mount;
    }
  }
}

export {};
