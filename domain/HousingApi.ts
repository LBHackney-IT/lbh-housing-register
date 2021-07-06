// I generated this using a rather clunky process of going here: https://app.swaggerhub.com/apis/tcmorris/housingRegisterAPI/1.0.0 and using the Typescript-fetch generator (export menu)
// then grabbing the bits that felt relevant.

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
  postCode?: string;
  /**
   *
   * @type {string}
   * @memberof Address
   */
  addressType?: string;
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
  eligibility?: Array<Question>;
  /**
   *
   * @type {Array<Question>}
   * @memberof Applicant
   */
  questions?: Array<Question>;
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
  createdAt?: string;
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
  ethnicity?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  nationality?: string;
  /**
   *
   * @type {string}
   * @memberof Person
   */
  placeOfBirth?: string;
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
  nationalInsuranceNumber?: string;
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
    Mrs = <any>'Mrs',
    Mr = <any>'Mr',
    Miss = <any>'Miss',
    Mx = <any>'Mx',
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
