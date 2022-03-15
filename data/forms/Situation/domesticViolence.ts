import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const domesticViolence: MultiStepForm = {
  id: FormID.DOMESTIC_VIOLENCE,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Are you fleeing domestic violence?',
          name: 'domestic-violence',
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
      fieldId: 'domestic-violence',
      value: 'yes',
      nextFormId: FormID.ARREARS,
    },
    {
      fieldId: 'domestic-violence',
      value: 'no',
      nextFormId: FormID.MEDICAL_NEED,
    },
  ],
};

export default domesticViolence;
