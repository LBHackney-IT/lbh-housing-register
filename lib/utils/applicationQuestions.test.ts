import { Applicant } from '../../domain/HousingApi';
import {
  getQuestionValue,
  jsonParse,
  questionLookup,
} from './applicationQuestions';

function applicantWithAnswer(answer: string): Applicant {
  return {
    questions: [{ id: 'money/income', answer }],
  } as Applicant;
}

describe('jsonParse', () => {
  test('parses valid JSON', () => {
    expect(jsonParse('"yes"')).toBe('yes');
    expect(jsonParse('123')).toBe(123);
    expect(jsonParse('null')).toBeNull();
  });

  test('falls back to an empty string on invalid JSON', () => {
    expect(jsonParse('not valid json')).toBe('');
  });

  test('falls back to an empty string when the input is nullish or empty', () => {
    expect(jsonParse(undefined)).toBe('');
    expect(jsonParse(null)).toBe('');
    expect(jsonParse('')).toBe('');
  });
});

describe('getQuestionValue', () => {
  test('returns N/A when the question has not been answered at all', () => {
    expect(getQuestionValue('money/income', {})).toBe('N/A');
  });

  test('returns N/A rather than throwing when the answer is the JSON literal "null"', () => {
    // JSON.stringify(null) produces the string "null" - a truthy string that
    // must not be treated as a real answer once parsed back.
    const applicant = applicantWithAnswer('null');
    expect(() => getQuestionValue('money/income', applicant)).not.toThrow();
    expect(getQuestionValue('money/income', applicant)).toBe('N/A');
  });

  test('returns N/A when the stored answer parses to an empty string', () => {
    const applicant = applicantWithAnswer('""');
    expect(getQuestionValue('money/income', applicant)).toBe('N/A');
  });

  test('capitalises a plain string answer', () => {
    const applicant = applicantWithAnswer('"yes"');
    expect(getQuestionValue('money/income', applicant)).toBe('Yes');
  });

  test('stringifies a numeric answer', () => {
    const applicant = applicantWithAnswer('1500');
    expect(getQuestionValue('money/income', applicant)).toBe('1500');
  });

  test('stringifies a boolean answer', () => {
    const applicant = applicantWithAnswer('true');
    expect(getQuestionValue('money/income', applicant)).toBe('True');
  });
});

describe('questionLookup', () => {
  test('returns undefined when the applicant is undefined', () => {
    expect(questionLookup('money/income', undefined)).toBeUndefined();
  });

  test('returns the raw stored answer for a matching question id', () => {
    const applicant = applicantWithAnswer('"yes"');
    expect(questionLookup('money/income', applicant)).toBe('"yes"');
  });
});
