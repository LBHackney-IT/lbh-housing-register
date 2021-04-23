import { Resident } from "./resident";

export interface Application {
  id: string;
  applicant: Resident;
  status: string;
  createdAt: string;
}
