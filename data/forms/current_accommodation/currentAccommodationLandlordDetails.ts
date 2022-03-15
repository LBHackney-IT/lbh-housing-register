import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const currentAccommodationLandlordDetails: MultiStepForm = {
  id: FormID.CURRENT_ACCOMMODATION_LANDLORD_DETAILS,
  heading: 'Current accommodation',
  steps: [
    {
      fields: [
        {
          label: 'Name of your landlord or housing association',
          name: 'landlord-name',
          hint: 'Tell us who owns the home you live in. This may be different from who manages the property.',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};
export default currentAccommodationLandlordDetails;
