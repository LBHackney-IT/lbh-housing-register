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


export const extractAdditionalResidentFromData = (data:any, countOfApplicants:any) => {
  console.log('extractAdditionalResidentFromData:', data)
  const fields = ['firstName', 'lastName', 'sex'];

  let additionalResidents:any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (!fields.includes(key)) {
      additionalResidents[key] = value;
    }
  }

  console.log('additionalResidents', additionalResidents)

  // then remove the 'additional-x' from the key name
  let orderResidentsTogether:any = {};
  let includedFields = [];
  for (let x = 1; x <= countOfApplicants; x++) {
    for(const [key, value] of Object.entries(additionalResidents)) {
      if(key.indexOf(x.toString())) {
        console.log('key', key)
        // console.log('value', value)
        // removal of additional-x has to happen here
        // only then populate orderResidentsTogether

        // it is overwritten because person-1 happens once and the loop 3 times...hence why
        orderResidentsTogether = {
          [key]: value,
          'person': x
        }


        // orderResidentsTogether[key] = value;
      }
    }
  }
  
  console.log('orderResidentsTogether', orderResidentsTogether)

  return additionalResidents
}


export const extractMainResidentFromData = (data:any) => {

  let mainResident:any = {};
  const expectedFields = ['firstName', 'lastName', 'sex'];

  for (const [key, value] of Object.entries(data)) {
    if (expectedFields.includes(key)) {
      mainResident[key] = value;
    }
  }
  return mainResident
}
