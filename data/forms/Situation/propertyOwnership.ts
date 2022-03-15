import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const propertyOwnership: MultiStepForm = {
  id: FormID.PROPERTY_OWNERSHIP,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Do you own or co-own any properties within the UK or abroad?',
          name: 'property-ownership',
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
      fieldId: 'property-ownership',
      value: 'yes',
      nextFormId: FormID.DOMESTIC_VIOLENCE,
    },
    {
      fieldId: 'property-ownership',
      value: 'no',
      nextFormId: FormID.SOLD_PROPERTY,
    },
  ],
};

export default propertyOwnership;
