import { Resident } from "./resident";

export interface ApplicationList {
  results: Array<Application>;
}

export interface Application {
  id: string;
  applicant: Resident;
  status: string;
  createdAt: string;
}
