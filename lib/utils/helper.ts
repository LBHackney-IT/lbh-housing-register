import { CreateApplicationRequest } from '../../domain/application';
import { Resident } from '../types/resident';

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
