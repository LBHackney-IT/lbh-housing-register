import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const otherHousingRegister: MultiStepForm = {
  id: FormID.OTHER_HOUSING_REGISTER,
  eligibility: [
    {
      field: 'other-housing-register',
      is: 'yes',
      reasoning: 'onAnotherHousingRegister',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Are you or your partner on another local authority’s housing register?',
          name: 'other-housing-register',
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
      fieldId: 'other-housing-register',
      value: 'yes',
      nextFormId: 'exit',
    },
    {
      fieldId: 'other-housing-register',
      value: 'no',
      nextFormId: FormID.BREACH_OF_TENANCY,
    },
  ],
};

export default otherHousingRegister;
