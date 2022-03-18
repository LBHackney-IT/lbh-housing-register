// I generated this using a rather clunky process of going here: https://app.swaggerhub.com/apis/tcmorris/housingRegisterAPI/1.0.0 and using the Typescript-fetch generator (export menu)
// then grabbing the bits that felt relevant.

export const APPLICATION_UNNASIGNED = 'unassigned';

/**
 *
 * @export
 * @interface Address
 */
export interface Address {
  /**
   *
   * @type {string}
   * @memberof Address
   */
  addressLine1?: string;
  /**
   *
   * @type {string}
   * @memberof Address
   */
  addressLine2?: string;
  /**
   *
   * @type {string}
   * @memberof Address
   */
  addressLine3?: string;
  /**
   *
   * @type {string}
   * @memberof Address
   */
  postcode?: string;
  /**
   *
   * @type {string}
   * @memberof Address
   */
  addressType?: string; //1 = main address, 2=correspondence address https://github.com/search?q=org%3ALBHackney-IT+addressType&type=code
}
export enum AddressType {
  MainAddress = '1',
  CorrespondenceAddress = '2',
}

/**
 *
 * @export
 * @interface Applicant
 */
export interface Applicant {
  /**
   *
   * @type {Person}
   * @memberof Applicant
   */
  person?: Person;
  /**
   *
   * @type {Address}
   * @memberof Applicant
   */
  address?: Address;
  /**
   *
   * @type {ContactInformation}
   * @memberof Applicant
   */
  contactInformation?: ContactInformation;
  /**
   *
   * @type {Array<Evidence>}
   * @memberof Applicant
   */
  evidence?: Array<Evidence>;
  /**
   *
   * @type {Array<Question>}
   * @memberof Applicant
   */
  questions?: Array<Question>;
  /**
   *
   * @type {boolean}
   * @memberof Applicant
   */
  requiresMedical?: boolean;
  /**
   *
   * @type {MedicalNeed}
   * @memberof Applicant
   */
  medicalNeed?: MedicalNeed;
}

export interface MedicalNeed {
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  formRecieved?: string;
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  assessmentDate?: string;
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  outcome?: string;
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  accessibileHousingRegister?: string;
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  disability?: string;
  /**
   *
   * @type {string}
   * @memberof MedicalNeed
   */
  additionalInformaton?: string;
}

/**
 *
 * @export
 * @interface Application
 */
export interface Application {
  /**
   *
   * @type {string}
   * @memberof Application
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof Application
   */
  status?: string;
  /**
   *
   * @type {string}
   * @memberof Application
   */
  assignedTo?: string;
  /**
   *
   * @type {boolean}
   * @memberof Application
   */
  sensitiveData?: boolean;
  /**
   *
   * @type {string}
   * @memberof Application
   */
  reference?: string;
  /**
   *
   * @type {string}
   * @memberof Application
   */
  createdAt?: string;
  /**
   *
   * @type {Applicant}
   * @memberof Application
   */
  submittedAt?: string;
  /**
   *
   * @type {Applicant}
   * @memberof Application
   */
  mainApplicant?: Applicant;
  /**
   *
   * @type {Array<Applicant>}
   * @memberof Application
   */
  otherMembers?: Array<Applicant>;
  /**
   *
   * @type {Assessment}
   * @memberof Application
   */
  assessment?: Assessment;
  /**
   *
   * @type {number}
   * @memberof Application
   */
  calculatedBedroomNeed?: number;

  /**
   *
   * @type {boolean}
   * @memberof Application
   */
  importedFromLegacyDatabase?: boolean;
}

/**
 *
 * @export
 * @interface ApplicationList
 */
export interface ApplicationList {
  /**
   *
   * @type {Array<Application>}
   * @memberof ApplicationList
   */
  results?: Array<Application>;
}

/**
 *
 * @export
 * @interface ContactInformation
 */
export interface ContactInformation {
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  emailAddress?: string;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  phoneNumber?: string;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  preferredMethodOfContact?: string;
}

/**
 *
 * @export
 * @interface Evidence
 */
export interface Evidence {
  /**
   *
   * @type {string}
   * @memberof Evidence
   */
  id?: string;
}

/**
 *
 * @export
 * @interface Assessment
 */
export interface Assessment {
  /**
   *
   * @type {string}
   * @memberof Assessment
   */
  effectiveDate?: string;
  /**
   *
   * @type {string}
   * @memberof Assessment
   */
  informationReceivedDate?: string;
  /**
   *
   * @type {number}
   * @memberof Assessment
   */
  bedroomNeed?: number;
  /**
   *
   * @type {string}
   * @memberof Assessment
   */
  band?: string;
  /**
   *
   * @type {string}
   * @memberof Assessment
   */
  reason?: string;
  /**
   *
   * @type {string}
   * @memberof Assessment
   */
  biddingNumber?: string;
  /**
   *
   * @type {boolean}
   * @memberof Assessment
   */
  generateBiddingNumber?: boolean;
}

/**
 *
 * @export
 * @interface Person
 */
export interface Person {
  /**
   *
   * @type {string}
   * @memberof Person
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  title?: Person.TitleEnum;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  firstName?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  middleName?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  surname?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  dateOfBirth?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  gender?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  genderDescription?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  nationalInsuranceNumber?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  relationshipType?: string;
}

/**
 * @export
 * @namespace Person
 */
export namespace Person {
  /**
   * @export
   * @enum {string}
   */
  export enum TitleEnum {
    Mrs = 'Mrs',
    Mr = 'Mr',
    Miss = 'Miss',
    Mx = 'Mx',
    // Allowable only in legacy imported records.
    Dr = 'Dr',
    Ms = 'Ms',
  }
}

/**
 *
 * @export
 * @interface Question
 */
export interface Question {
  /**
   *
   * @type {string}
   * @memberof Question
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof Question
   */
  answer?: string;
}

/**
 *
 * @export
 * @interface PaginatedApplicationListResponse
 */
export interface PaginatedApplicationListResponse {
  /**
   *
   * @type {Array<Application>}
   * @memberof PaginatedApplicationListResponse
   */
  results: Array<Application>;
  /**
   *
   * @type {Array<Application>}
   * @memberof PaginatedApplicationListResponse
   */
  paginationToken: string | null;
}

export interface CreateAuthRequest {
  email: string;
}
export interface CreateAuthResponse {
  success: boolean;
}

export interface VerifyAuthRequest {
  email: string;
  code: string;
}
export interface VerifyAuthResponse {
  accessToken: string;
}

export interface CreateEvidenceRequest {
  userRequestedBy?: string;
  documentTypes: string[];
}
export interface EvidenceRequestResponse {
  id: string;
  createdAt: string;
}
export interface SimpleTypeResponse<T> {
  value: T;
}

export interface AddNoteToHistoryRequest {
  Note: string;
}
