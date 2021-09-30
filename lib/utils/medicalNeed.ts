import { Applicant, Application } from '../../domain/HousingApi';

export const applicantHasMedicalNeed = (applicant?: Applicant): boolean => {
  if (applicant === undefined) {
    return false;
  }

  return (
    applicant.questions?.find((q) => q.id === `medical-needs/medical-needs`)
      ?.answer === 'true'
  );
};

export const applicantsWithMedicalNeed = (application: Application): number => {
  let medicalNeeds = 0;

  const mainApplicantHasMedicalNeed = applicantHasMedicalNeed(
    application.mainApplicant
  );
  if (mainApplicantHasMedicalNeed) {
    medicalNeeds = 1;
  }

  const otherApplicantsWithMedicalNeeds = application.otherMembers?.map(
    (applicant) => applicantHasMedicalNeed(applicant)
  );
  if (otherApplicantsWithMedicalNeeds) {
    medicalNeeds = medicalNeeds + otherApplicantsWithMedicalNeeds.length;
  }

  return medicalNeeds;
};
