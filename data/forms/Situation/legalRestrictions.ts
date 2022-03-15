import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const legalRestrictions: MultiStepForm = {
  id: FormID.LEGAL_RESTRICTIONS,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Does anyone in your household have any legal restrictions in where you can live?',
          name: 'legal-restrictions',
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
        {
          as: 'textarea',
          label: 'Details of legal restrictions',
          name: 'details',
          validation: {
            required: true,
          },
          conditionalDisplay: [
            {
              field: 'legal-restrictions',
              is: 'yes',
            },
          ],
        },
      ],
    },
  ],
  conditionals: [
    {
      fieldId: 'legal-restrictions',
      value: 'yes',
      nextFormId: FormID.UNSPENT_CONVICTIONS,
    },
    {
      fieldId: 'legal-restrictions',
      value: 'no',
      nextFormId: FormID.UNSPENT_CONVICTIONS,
    },
  ],
};

export default legalRestrictions;
