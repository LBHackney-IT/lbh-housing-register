import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const unspentConvictions: MultiStepForm = {
  id: FormID.UNSPENT_CONVICTIONS,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Does anyone in your household have any unspent convictions?',
          name: 'unspent-convictions',
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
        {
          as: 'textarea',
          label: 'Details of unspent convictions',
          name: 'details',
          validation: {
            required: true,
          },
          conditionalDisplay: [
            {
              field: 'unspent-convictions',
              is: 'yes',
            },
          ],
        },
      ],
    },
  ],
  conditionals: [
    {
      fieldId: 'unspent-convictions',
      value: 'yes',
      nextFormId: 'exit',
    },
    {
      fieldId: 'unspent-convictions',
      value: 'no',
      nextFormId: 'exit',
    },
  ],
};

export default unspentConvictions;
