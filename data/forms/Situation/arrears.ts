import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const arrears: MultiStepForm = {
  id: FormID.ARREARS,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Are you in 4 weeks or more arrears with your rent, council tax or service charges?',
          name: 'arrears',
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
      fieldId: 'arrears',
      value: 'yes',
      nextFormId: FormID.UNDER_OCCUPYING,
    },
    {
      fieldId: 'arrears',
      value: 'no',
      nextFormId: FormID.BREACH_OF_TENANCY,
    },
  ],
};
export default arrears;
