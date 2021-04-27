import { Address } from "./address"

export interface Resident extends IPerson {
  email: string;
  phoneNumber: string;
  address: Address;
}

export interface IPerson {
  id: string;
  title: string;
  firstname: string;
  middleName: string;
  surname: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: string;
}
