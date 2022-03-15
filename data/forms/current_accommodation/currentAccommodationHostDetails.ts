import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const currentAccommodationHostDetails: MultiStepForm = {
  id: FormID.CURRENT_ACCOMMODATION_HOST_DETAILS,
  heading: 'Current accommodation',
  steps: [
    {
      fields: [
        {
          label: 'Name of the person who hosts you in their home',
          name: 'host-person-name',
          hint: 'If you are street homeless, please state below',
          validation: {
            required: true,
          },
        },
        {
          label: 'Phone number of your host',
          name: 'host-person-number',
          hint: 'Please provide this information if you know it. This may help assess your application more quickly.',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};
export default currentAccommodationHostDetails;
