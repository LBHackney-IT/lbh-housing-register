import app from 'next/app';
import {
  CreateApplicationRequest,
  Application,
} from '../../domain/application';
import { Resident as DomainResident } from '../../domain/resident';
import { Store } from '../store';
import { MainResident, Resident } from '../types/resident';

// convert an application in react state into an application for the api
export const constructApplication = (applicants: Resident[]) => {
  const personal = applicants[0].formData['personal-details'];
  const address = applicants[0].formData['address-details'];
  const contactInformation = {
    emailAddress: applicants[0].formData[''],
    phoneNumber: '',
    preferredMethodOfContact: '',
  };

  const applicant = {
    personal,
    address,
    contactInformation,
  };
  const application: CreateApplicationRequest = {
    status: 'Pending',
    applicant,
    otherMembers:
      applicants.length > 1
        ? applicants
            .slice(1)
            .map((resident) => resident?.formData['personal-details'])
        : [],
  };

  return application;
};

export function extractFormData(
  applicant: DomainResident
): Resident['formData'] {
  console.log(applicant);
  return {
    // TODO This mapping of one data type to another needs removing.
    'personal-details': applicant.person,
    'address-details': applicant.address,
  };
}
