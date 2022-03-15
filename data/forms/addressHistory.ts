import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const addressHistory: MultiStepForm = {
  id: FormID.ADDRESS_HISTORY,
  steps: [
    {
      fields: [
        {
          label: 'Postcode',
          name: 'address-finder',
          validation: {
            required: false,
          },
        },
      ],
    },
  ],
};
export default addressHistory;
