import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const courtOrder: MultiStepForm = {
  id: FormID.COURT_ORDER,
  eligibility: [
    {
      field: 'court-order',
      is: 'no',
      reasoning: 'squatting',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Do you have a court order allowing you to be on the register?',
          name: 'court-order',
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
          label: 'Details of court order',
          name: 'details',
          validation: {
            required: true,
          },
          conditionalDisplay: [
            {
              field: 'court-order',
              is: 'yes',
            },
          ],
        },
      ],
    },
  ],
  conditionals: [
    {
      fieldId: 'court-order',
      value: 'yes',
      nextFormId: FormID.ARREARS,
    },
    {
      fieldId: 'court-order',
      value: 'no',
      nextFormId: 'exit',
    },
  ],
};
export default courtOrder;
