import { Applicant } from '../../domain/HousingApi';

export const applicantHasMedicalNeed = (applicant?: Applicant): boolean => {
  if (applicant === undefined) {
    return false;
  }

  return (
    applicant.questions?.find((q) => q.id === `medical-needs/medical-needs`)
      ?.answer === 'true'
  );
};
