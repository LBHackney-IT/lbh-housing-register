import { Resident } from './resident';

export interface ApplicationList {
  results: Array<Application>;
}

export interface Application {
  id: string;
  status: string;
  createdAt: string;
  mainApplicant: Resident;
  otherMembers: Array<Resident>;
}

export interface CreateApplicationRequest {
  applicant: any;
  otherMembers: any;
  status: string;
}
