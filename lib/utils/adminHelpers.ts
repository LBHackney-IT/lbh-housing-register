import { getFormData, FormID } from '../utils/form-data';
import { FormField } from '../../lib/types/form';
import { kebabToCamelCase, camelCaseToKebab } from '../../lib/utils/capitalize';
import { FormikValues } from 'formik';

export interface Address {
  addressLine1: string;
  addressLine2: string;
  addressTownCity: string;
  addressCounty: string;
  addressPostcode: string;
}

interface SectionData {
  fields: FormField[];
  sectionId: string;
  sectionHeading: string | undefined;
}

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
  const addressesWithoutCurrent = addresses.filter((_, index) => index !== 0);

  for (const [key, value] of Object.entries(values)) {
    // Return question Ids to correct syntax for API
    const questionId = camelCaseToKebab(key).replace('_', '/');

    // Don't include personal details
    if (questionId.startsWith('personal-details/')) continue;

    // Use custom address fields
    if (questionId === 'address-history/address-finder') {
      questionArray.push({
        id: questionId,
        answer: JSON.stringify(addressesWithoutCurrent),
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
