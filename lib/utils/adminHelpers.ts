import { getFormData, FormID } from '../utils/form-data';
import { FormField } from '../../lib/types/form';
import { kebabToCamelCase, camelCaseToKebab } from '../../lib/utils/capitalize';
import { FormikValues } from 'formik';
import * as Yup from 'yup';
import { INVALID_DATE } from '../../components/form/dateinput';
export interface Address {
  address: {
    line1: string;
    line2: string;
    town: string;
    county: string;
    postcode: string;
  };
  date: string;
  dateTo: string;
}

export interface SectionData {
  fields: FormField[];
  sectionId: string;
  sectionHeading: string | undefined;
}

export const convertAddressToPrimary = (addressHistoryItem: Address) => {
  const { line1, line2, town, county, postcode } = addressHistoryItem.address;
  return {
    addressLine1: line1,
    addressLine2: line2,
    addressLine3: town ?? county,
    postcode: postcode,
    addressType: '1',
  };
};

export const addCaseSchema = Yup.object({
  personalDetails_title: Yup.string().label('Title').required(),
  personalDetails_firstName: Yup.string().label('First name').required(),
  personalDetails_surname: Yup.string().label('Surname').required(),
  personalDetails_dateOfBirth: Yup.string()
    .notOneOf([INVALID_DATE], 'Invalid date')
    .label('Date of birth')
    .required()
    .test('futureDate', 'Date of birth must be in the past', (value) => {
      if (typeof value !== 'string' || value === INVALID_DATE) {
        return false;
      }

      const dateOfBirth = +new Date(value);

      if (Math.min(+new Date()) < dateOfBirth) {
        return false;
      }

      return true;
    }),
  personalDetails_gender: Yup.string().label('Gender').required(),
});

const additionalValidationForMainApplicant = Yup.object({
  currentAccommodation_livingSituation: Yup.string()
    .label('Living situation')
    .required(),
  immigrationStatus_citizenship: Yup.string().label('Citizenship').required(),
});

export const mainApplicantSchema = addCaseSchema.concat(
  additionalValidationForMainApplicant,
);

export const allFormSections = (keysToIgnore: string[]) => {
  const keys = Object.keys(FormID);

  const sections = keys
    .filter((key) => !keysToIgnore.includes(key))
    .map((key) => getFormData(FormID[key as keyof typeof FormID]));

  const sectionData = sections.map((section) => {
    const stepsInSection = section.steps.flat();
    const fieldsInSection = stepsInSection.flatMap((step) => step.fields);

    return {
      sectionHeading: section.heading || '',
      sectionId: section.id || '',
      fields: fieldsInSection,
    };
  });

  return sectionData;
};

export const getSectionData = (sectionId: FormID) => {
  const section = getFormData(sectionId);
  const stepsInSection = section.steps.flat();
  const fieldsInSection = stepsInSection.flatMap((step) => step.fields);

  return {
    sectionHeading: section.heading || '',
    sectionId: section.id || '',
    fields: fieldsInSection,
  };
};

export const generateEditInitialValues = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- legacy admin edit payload shape
  data: any,
  isMainApplicant: boolean,
) => {
  const questionData = isMainApplicant
    ? data.mainApplicant.questions
    : data.questions;

  const personData = isMainApplicant ? data.mainApplicant : data;

  const questionsInitialValuesObject = questionData
    ? questionData.reduce(
        (
          acc: { [key: string]: string },
          current: { [key: string]: string },
        ) => {
          const questionFieldName = kebabToCamelCase(current.id).replaceAll(
            '/',
            '_',
          );

          const answer = current.answer
            ? current.answer.replaceAll(/[[\]"]+/g, '')
            : '';

          return {
            ...acc,
            [questionFieldName]: answer,
          };
        },
        {},
      )
    : {};

  const initialValuesObject = {
    ...questionsInitialValuesObject,
    personalDetails_title: personData?.person?.title,
    personalDetails_firstName: personData?.person?.firstName,
    personalDetails_surname: personData?.person?.surname,
    personalDetails_dateOfBirth: personData?.person?.dateOfBirth,
    personalDetails_gender: personData?.person?.gender,
    personalDetails_genderDescription: personData?.person?.genderDescription,
    personalDetails_nationalInsuranceNumber:
      personData?.person?.nationalInsuranceNumber,
    personalDetails_relationshipType: personData?.person?.relationshipType,
    personalDetails_emailAddress: personData?.contactInformation?.emailAddress,
    personalDetails_phoneNumber: personData?.contactInformation?.phoneNumber,
  };

  return initialValuesObject;
};

export const generateInitialValues = (sections: SectionData[]) => {
  const allFieldNames = sections.flatMap((section) =>
    section.fields.map((field: FormField) =>
      generateUniqueFieldName(section.sectionId, field.name),
    ),
  );

  const initialValuesObject = allFieldNames.reduce(
    (acc: { [key: string]: string }, current) => ((acc[current] = ''), acc),
    {},
  );

  return initialValuesObject;
};

export const generateUniqueFieldName = (sectionId: string, fieldName: string) =>
  `${kebabToCamelCase(sectionId)}_${kebabToCamelCase(fieldName)}`;

export const generateQuestionArray = (
  values: FormikValues,
  addresses: Address[],
  ethnicity?: string,
) => {
  const questionArray = [];
  for (const [key, value] of Object.entries(values)) {
    // Return question Ids to correct syntax for API
    const questionId = camelCaseToKebab(key).replaceAll('_', '/');

    // Don't include personal details
    if (questionId.startsWith('personal-details/')) continue;

    if (
      questionId === 'address-history/address-finder' ||
      questionId === 'address-history/address-history'
    ) {
      questionArray.push({
        id: 'address-history/addressHistory',
        answer: JSON.stringify(addresses),
      });
    } else if (questionId === 'ethnicity-questions/ethnicity-main-category') {
      questionArray.push({
        id: 'ethnicity-questions/ethnicity-main-category',
        answer: JSON.stringify(ethnicity),
      });
    } else if (value === '') {
      continue;
    } else {
      questionArray.push({
        id: questionId,
        answer: JSON.stringify(value),
      });
    }
  }

  return questionArray;
};
