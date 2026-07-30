import { Applicant } from '../../domain/HousingApi';
import {
  addressHistoryCheckboxList,
  personalDetailsCheckboxList,
  residentialStatusCheckboxList,
} from './checkboxListData';
import { QuestionKey } from './question-data';

function applicantWithQuestions(
  questions: { id: string; answer: string }[],
): Applicant {
  return { questions } as Applicant;
}

function rowValue(
  list: { data: { title: string; value: string }[] },
  title: string,
) {
  return list.data.find((row) => row.title === title)?.value;
}

describe('residentialStatusCheckboxList - institutions', () => {
  test('renders N/A when the question has not been answered', () => {
    const applicant = applicantWithQuestions([]);
    const list = residentialStatusCheckboxList(applicant);
    expect(
      rowValue(
        list,
        'Applicant has been staying at the following institutions for the last 3 years',
      ),
    ).toBe('N/A');
  });

  test('does not throw, and renders N/A, when the stored answer is the JSON literal "null"', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.RESIDENTIAL_STATUS_INSTITUTIONS, answer: 'null' },
    ]);
    expect(() => residentialStatusCheckboxList(applicant)).not.toThrow();
    const list = residentialStatusCheckboxList(applicant);
    expect(
      rowValue(
        list,
        'Applicant has been staying at the following institutions for the last 3 years',
      ),
    ).toBe('N/A');
  });

  test('concatenates institution names when answered', () => {
    const applicant = applicantWithQuestions([
      {
        id: QuestionKey.RESIDENTIAL_STATUS_INSTITUTIONS,
        answer: JSON.stringify(['Hospital', 'Care Home']),
      },
    ]);
    const list = residentialStatusCheckboxList(applicant);
    expect(
      rowValue(
        list,
        'Applicant has been staying at the following institutions for the last 3 years',
      ),
    ).toBe('HospitalCare Home');
  });
});

describe('addressHistoryCheckboxList', () => {
  test('renders no rows when the question has not been answered', () => {
    const applicant = applicantWithQuestions([]);
    expect(addressHistoryCheckboxList(applicant).data).toEqual([]);
  });

  test('does not throw, and renders no rows, when the stored answer is the JSON literal "null"', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.ADDRESS_HISTORY, answer: 'null' },
    ]);
    expect(() => addressHistoryCheckboxList(applicant)).not.toThrow();
    expect(addressHistoryCheckboxList(applicant).data).toEqual([]);
  });

  test('renders address rows when answered', () => {
    const applicant = applicantWithQuestions([
      {
        id: QuestionKey.ADDRESS_HISTORY,
        answer: JSON.stringify([
          {
            postcode: 'E8 1AB',
            date: '2021-01-01',
            dateTo: '',
            address: { line1: 'Address Line One', town: 'London' },
          },
        ]),
      },
    ]);
    const list = addressHistoryCheckboxList(applicant);
    expect(list.data).toHaveLength(1);
    expect(list.data[0].title).toBe('Current address');
    expect(list.data[0].value).toContain('Address Line One');
  });
});

describe('personalDetailsCheckboxList - ethnicity', () => {
  test('renders N/A when the main category has not been answered', () => {
    const applicant = applicantWithQuestions([]);
    const list = personalDetailsCheckboxList(applicant);
    expect(rowValue(list, 'Ethnicity')).toBe('N/A');
  });

  test('renders N/A rather than the literal text "undefined" when the extended category answer is the JSON literal "null"', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
      { id: 'ethnicity-extended-category-asian', answer: 'null' },
    ]);
    const list = personalDetailsCheckboxList(applicant);
    expect(rowValue(list, 'Ethnicity')).toBe('N/A');
  });

  test('renders N/A rather than throwing when the extended category answer is missing', () => {
    const applicant = {
      questions: [
        { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
        // Domain type allows answer to be optional - previously forced through
        // with `answer!` which would make JSON.parse(undefined) throw.
        { id: 'ethnicity-extended-category-asian' },
      ],
    } as Applicant;
    expect(() => personalDetailsCheckboxList(applicant)).not.toThrow();
    expect(rowValue(personalDetailsCheckboxList(applicant), 'Ethnicity')).toBe(
      'N/A',
    );
  });

  test('renders N/A rather than throwing when the extended category answer is invalid JSON', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
      { id: 'ethnicity-extended-category-asian', answer: 'not-valid-json' },
    ]);
    expect(() => personalDetailsCheckboxList(applicant)).not.toThrow();
    expect(rowValue(personalDetailsCheckboxList(applicant), 'Ethnicity')).toBe(
      'N/A',
    );
  });

  test('renders N/A rather than throwing when the extended category answer does not match any known option', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
      {
        id: 'ethnicity-extended-category-asian',
        answer: '"some-retired-legacy-value"',
      },
    ]);
    expect(() => personalDetailsCheckboxList(applicant)).not.toThrow();
    expect(rowValue(personalDetailsCheckboxList(applicant), 'Ethnicity')).toBe(
      'N/A',
    );
  });

  test('renders the matching label when answered', () => {
    const applicant = applicantWithQuestions([
      { id: QuestionKey.ETHNICITY_MAIN_CATEGORY, answer: '"asian"' },
      { id: 'ethnicity-extended-category-asian', answer: '"indian"' },
    ]);
    const list = personalDetailsCheckboxList(applicant);
    expect(rowValue(list, 'Ethnicity')).toBe('Indian');
  });
});
