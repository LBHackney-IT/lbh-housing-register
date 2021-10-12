import { Applicant, Application } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormID } from './form-data';

export const applicantHasMedicalNeed = (applicant?: Applicant): boolean => {
  if (applicant === undefined) {
    return false;
  }

  const medicalNeeds = getQuestionValue(
    applicant.questions,
    FormID.MEDICAL_NEEDS,
    'medical-needs'
  );
  console.log(medicalNeeds);
  return medicalNeeds === 'yes' ?? false;
};

export const applicantsWithMedicalNeed = (application: Application): number => {
  const mainApplicantHasMedicalNeed = applicantHasMedicalNeed(
    application.mainApplicant
  );
  const otherApplicantsWithMedicalNeeds = application.otherMembers
    ?.map((applicant) => applicantHasMedicalNeed(applicant))
    .filter((x) => x);

  const totalNumberOfPeopleWithMedicalNeeds =
    (mainApplicantHasMedicalNeed === true ? 1 : 0) +
    (otherApplicantsWithMedicalNeeds?.length === undefined
      ? 0
      : otherApplicantsWithMedicalNeeds.length);

  return totalNumberOfPeopleWithMedicalNeeds;
};
