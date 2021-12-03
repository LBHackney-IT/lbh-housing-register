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

interface SectionData {
  fields: FormField[];
  sectionId: string;
  sectionHeading: string | undefined;
}

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
  personalDetails_nationalInsuranceNumber: Yup.string()
    .label('NI number')
    .required(),
  immigrationStatus_citizenship: Yup.string().label('Citizenship').required(),
});

const currentAccommodationSchema = Yup.object({
  currentAccommodation_livingSituation: Yup.string()
    .label('Living situation')
    .required(),
});

export const mainApplicantSchema = addCaseSchema.concat(
  currentAccommodationSchema
);

export const allFormSections = (keysToIgnore: string[]) => {
  const keys = Object.keys(FormID);

  const sections = keys
    .filter((key) => !keysToIgnore.includes(key))
    .map((key) => getFormData(FormID[key as keyof typeof FormID]));

  const sectionData = sections.map((section) => {
    const stepsInSection = section.steps.flat();
    const fieldsInSection = stepsInSection.map((step) => step.fields).flat();

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
  const fieldsInSection = stepsInSection.map((step) => step.fields).flat();

  return {
    sectionHeading: section.heading || '',
    sectionId: section.id || '',
    fields: fieldsInSection,
  };
};

export const generateInitialValues = (sections: SectionData[]) => {
  const allFieldNames = sections
    .map((section) =>
      section.fields.map((field: FormField) => {
        const updatedFieldName = generateUniqueFieldName(
          section.sectionId,
          field.name
        );
        return updatedFieldName;
      })
    )
    .flat();

  const initialValuesObject = allFieldNames.reduce(
    (acc: { [key: string]: string }, current) => ((acc[current] = ''), acc),
    {}
  );
  return initialValuesObject;
};

export const generateUniqueFieldName = (sectionId: string, fieldName: string) =>
  `${kebabToCamelCase(sectionId)}_${kebabToCamelCase(fieldName)}`;

export const generateQuestionArray = (
  values: FormikValues,
  addresses: Address[]
) => {
  const questionArray = [];
  // const addressesWithoutCurrent = addresses.filter((_, index) => index !== 0);

  for (const [key, value] of Object.entries(values)) {
    // Return question Ids to correct syntax for API
    const questionId = camelCaseToKebab(key).replace('_', '/');

    // Don't include personal details
    if (questionId.startsWith('personal-details/')) continue;

    // Use custom address fields
    if (questionId === 'address-history/address-finder') {
      questionArray.push({
        id: 'address-history/addressHistory',
        answer: JSON.stringify(addresses),
      });
    } else {
      questionArray.push({
        id: questionId,
        answer: JSON.stringify(value),
      });
    }
  }

  return questionArray;
};
