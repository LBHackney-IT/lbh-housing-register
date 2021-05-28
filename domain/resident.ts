// this matches the 'person' api
export interface Person {
  id?: string;
  title?: string;
  firstName: string;
  middleName?: string;
  surname: string;
  ethnicity?: string;
  nationality?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: string;
}

// extra properties for our purpose
export interface Resident {
  person: Person;
  contactInformation: ContactInformation;
  address: Address;
}

export interface ContactInformation {
  emailAddress: string;
  phoneNumber: string;
  preferredMethodOfContact: string;
}

export interface Address {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postCode: string;
}
