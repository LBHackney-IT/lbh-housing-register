import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const purchasingProperty: MultiStepForm = {
  id: FormID.PURCHASING_PROPERTY,
  eligibility: [
    {
      field: 'purchasing-property',
      is: 'yes',
      reasoning: 'ownOrSoldProperty',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Are you able to buy a property to meet your needs?',
          name: 'purchasing-property',
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
      fieldId: 'purchasing-property',
      value: 'yes',
      nextFormId: 'exit',
    },
    {
      fieldId: 'purchasing-property',
      value: 'no',
      nextFormId: FormID.ARREARS,
    },
  ],
};

export default purchasingProperty;
