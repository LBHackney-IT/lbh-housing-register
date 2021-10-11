import { getFormData, FormID } from '../utils/form-data';
import { FormField } from '../../lib/types/form';
import { kebabToCamelCase } from '../../lib/utils/capitalize';

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

export const generateInitialValues = (sections: SectionData[]) => {
  const allFieldNames = sections
    .map((section: any) =>
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
    (acc, current) => ((acc[current] = ''), acc),
    {}
  );
  return initialValuesObject;
};

export const generateUniqueFieldName = (sectionId: string, fieldName: string) =>
  `${kebabToCamelCase(sectionId)}_${kebabToCamelCase(fieldName)}`;
