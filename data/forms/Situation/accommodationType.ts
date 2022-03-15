import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const accommodationType: MultiStepForm = {
  id: FormID.ACCOMODATION_TYPE,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Are you a social tenant or in temporary accommodation?',
          name: 'accommodation-type',
          options: [
            {
              label: 'Yes - social tenant or in temporary accommodation',
              value: 'yes',
            },
            {
              label: "No - I'm not either of these",
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
      fieldId: 'accommodation-type',
      value: 'yes',
      nextFormId: FormID.SUBLETTING,
    },
    {
      fieldId: 'accommodation-type',
      value: 'no',
      nextFormId: FormID.ARREARS,
    },
  ],
};
export default accommodationType;
