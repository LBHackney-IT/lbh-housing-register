import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const underOccupying: MultiStepForm = {
  id: FormID.UNDER_OCCUPYING,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Are you under-occupying?',
          name: 'under-occupying',
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
      fieldId: 'under-occupying',
      value: 'yes',
      nextFormId: FormID.OTHER_HOUSING_REGISTER,
    },
    {
      fieldId: 'under-occupying',
      value: 'no',
      nextFormId: FormID.BENEFITS,
    },
  ],
};

export default underOccupying;
