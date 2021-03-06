import { Applicant } from '../../domain/HousingApi';
import capitalize from './capitalize';

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

export const jsonParse = (parseItem: string): string => {
  try {
    return JSON.parse(parseItem);
  } catch {
    return '';
  }
};

export const getQuestionValue = (
  questionId: string,
  applicant?: Applicant
): string => {
  const questionValue = questionLookup(questionId, applicant);
  return questionValue
    ? capitalize(jsonParse(questionValue).toString())
    : 'N/A';
};
