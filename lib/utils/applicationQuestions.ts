import { Applicant } from '../../domain/HousingApi';

export const questionLookup = (
  questionId: string,
  applicant?: Applicant
): string | undefined => {
  if (applicant === undefined) {
    return undefined;
  }

  if (questionId === undefined) {
    return undefined;
  }

  return applicant?.questions?.find((q) => q.id === questionId)?.answer;
};
