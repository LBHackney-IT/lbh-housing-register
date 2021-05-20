import { Resident } from "./resident";

export interface ApplicationList {
  results: Array<Application>;
}

export interface Application {
  id?: string;
  applicant: Resident;
  otherMembers: Array<Resident>;
  status: string;
  createdAt: string;
}

export const exampleApplication: Application = {
  id: "b38fff4c-a249-45e1-accd-dbd997a42c42",
  applicant: {
    id: "cc4251ff-e716-4fe2-acf3-04b7e111a60e",
    title: "Miss",
    firstName: "Test",
    middleName: "",
    surname: "Person",
    ethnicity: "White",
    nationality: "British",
    placeOfBirth: "London",
    dateOfBirth: "1990-02-19",
    gender: "F",
    contactInformation: {
      emailAddress: "test@email.com",
      phoneNumber: "+447123456780",
      preferredMethodOfContact: "email"
    },
    address: {
      addressLine1: "123 Hillman Street",
      addressLine2: "Hackney",
      addressLine3: "London",
      postCode: "E8 1DY"
    }
  },
  otherMembers: [{
    id: "899bcafd-cd07-473e-8573-83f624e0a780",
    title: "Mrs",
    firstName: "Other",
    middleName: "",
    surname: "Person",
    ethnicity: "Black Caribbean",
    nationality: "British",
    placeOfBirth: "London",
    dateOfBirth: "1982-02-20",
    gender: "F",
    contactInformation: {
      emailAddress: "test@email.com",
      phoneNumber: "+447123456780",
      preferredMethodOfContact: "email"
    },
    address: {
      addressLine1: "12345 Hillman Street",
      addressLine2: "Hackney",
      addressLine3: "London",
      postCode: "E8 1DY"
    }
  },
  {
    id: "0cbfe923-0185-4033-9c09-49af82083f7e",
    title: "Mr",
    firstName: "Sample",
    surname: "Person"
  }],
  status: "Pending",
  createdAt: "1 day ago"
}
