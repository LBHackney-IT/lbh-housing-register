import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const benefits: MultiStepForm = {
  id: FormID.BENEFITS,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Are the arrears due to a delay in processing your housing benefits or universal credit claim?',
          name: 'benefits',
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
      fieldId: 'benefits',
      value: 'yes',
      nextFormId: FormID.OTHER_HOUSING_REGISTER,
    },
    {
      fieldId: 'benefits',
      value: 'no',
      nextFormId: FormID.LANDLORD,
    },
  ],
};

export default benefits;
