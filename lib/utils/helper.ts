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

export const extractAdditionalResidentFromData = (
  data: any,
  countOfApplicants: any
) => {
  const fields = ['firstName', 'lastName', 'sex', 'birthday'];

  // 1. Remove main resident from object
  // 2. Combine person data that belong together
  // 3. Remove the 'additional-x' from names
  // 4. Return || update store accordingly

  // 1
  let additionalResidents: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (!fields.includes(key)) {
      additionalResidents[key] = value;
    }
  }

  // 2 & 3
  let orderResidentsTogether: any = {};
  let includedFields: any = {};
  for (let x = 1; x <= countOfApplicants; x++) {
    for (const [key, value] of Object.entries(additionalResidents)) {
      if (key.indexOf(x.toString())) {
        includedFields[key.split('-')[0]] = value;
        orderResidentsTogether[`person${x}`] = includedFields;
      }
    }
  }
  // 4
  return orderResidentsTogether;
};

export const extractMainResidentFromData = (data: any) => {
  let mainResident: any = {};
  const expectedFields = ['firstName', 'lastName', 'sex', 'birthday'];

  for (const [key, value] of Object.entries(data)) {
    if (expectedFields.includes(key)) {
      mainResident[key] = value;
    }
  }
  return mainResident;
};
