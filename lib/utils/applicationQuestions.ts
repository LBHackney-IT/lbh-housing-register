import { Applicant } from '../../domain/HousingApi';
import capitalize from './capitalize';

export const questionLookup = (
  questionId: string,
  applicant?: Applicant,
): string | undefined => {
  if (applicant === undefined) {
    return undefined;
  }

  if (questionId === undefined) {
    return undefined;
  }

  return applicant?.questions?.find((q) => q.id === questionId)?.answer;
};

export const jsonParse = (parseItem: string): unknown => {
  try {
    return JSON.parse(parseItem);
  } catch {
    return '';
  }
};

export const getQuestionValue = (
  questionId: string,
  applicant?: Applicant,
): string => {
  const questionValue = questionLookup(questionId, applicant);
  if (questionValue === undefined) {
    return 'N/A';
  }

  // Answers are stored via JSON.stringify, so an unanswered question can be
  // persisted as the *string* "null" (JSON.stringify(null)) - that string is
  // truthy, but parses back to the JS value `null`, which has no .toString().
  const parsedValue = jsonParse(questionValue);
  return parsedValue === null || parsedValue === undefined || parsedValue === ''
    ? 'N/A'
    : capitalize(String(parsedValue));
};
