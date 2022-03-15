import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const ethnicityQuestions: MultiStepForm = {
  id: FormID.ETHNICITY_QUESTIONS,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'What is your ethnic group?',
          name: 'ethnicity-main-category',
          details: {
            title: 'Why we ask for this information',
            content:
              'We regularly collect equality information from members of the public to ensure our services reach the people who need them. Your answer to this question won’t affect your application.',
          },
          options: [
            {
              label: 'Asian or Asian British',
              value: 'asian-asian-british',
            },
            {
              label: 'Black or Black British',
              value: 'black-black-british',
            },
            {
              label: 'Mixed or multiple background',
              value: 'mixed-or-multiple-background',
            },
            {
              label: 'White',
              value: 'white',
            },
            {
              label: 'Other ethnic group',
              value: 'other-ethnic-group',
            },
            {
              label: 'Prefer not to say',
              value: 'prefer-not-to-say',
            },
          ],
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
  conditionals: [
    {
      fieldId: 'ethnicity-main-category',
      value: 'asian-asian-british',
      nextFormId: FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH,
    },

    {
      fieldId: 'ethnicity-main-category',
      value: 'black-black-british',
      nextFormId: FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH,
    },

    {
      fieldId: 'ethnicity-main-category',
      value: 'mixed-or-multiple-background',
      nextFormId: FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND,
    },

    {
      fieldId: 'ethnicity-main-category',
      value: 'white',
      nextFormId: FormID.ETHNICITY_CATEGORY_WHITE,
    },

    {
      fieldId: 'ethnicity-main-category',
      value: 'other-ethnic-group',
      nextFormId: FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP,
    },

    {
      fieldId: 'ethnicity-main-category',
      value: 'perfer-not-to-say',
      nextFormId: 'exit',
    },
  ],
};
export default ethnicityQuestions;
