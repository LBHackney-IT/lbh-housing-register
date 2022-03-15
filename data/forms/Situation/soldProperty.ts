import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const soldProperty: MultiStepForm = {
  id: FormID.SOLD_PROPERTY,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Have you sold property in the last 5 years?',
          name: 'sold-property',
          options: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
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
      fieldId: 'sold-property',
      value: 'yes',
      nextFormId: FormID.RELATIONSHIP_BREAKDOWN,
    },
    {
      fieldId: 'sold-property',
      value: 'no',
      nextFormId: FormID.ARREARS,
    },
  ],
};

export default soldProperty;
