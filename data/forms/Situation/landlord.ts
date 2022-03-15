import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const landlord: MultiStepForm = {
  id: FormID.LANDLORD,
  eligibility: [
    {
      field: 'landlord',
      is: 'no',
      reasoning: 'rentArrears',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Have you made a recorded agreement with your landlord or the council to pay off the rent arrears and kept to this agreement for 6 months?',
          name: 'landlord',
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
      fieldId: 'landlord',
      value: 'yes',
      nextFormId: FormID.OTHER_HOUSING_REGISTER,
    },
    {
      fieldId: 'landlord',
      value: 'no',
      nextFormId: 'exit',
    },
  ],
};

export default landlord;
