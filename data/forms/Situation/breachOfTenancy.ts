import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const breachOfTenancy: MultiStepForm = {
  id: FormID.BREACH_OF_TENANCY,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Has anyone in your household ever received a warning for a breach of tenancy?',
          name: 'breach-of-tenancy',
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
          label: 'Details of breach',
          name: 'details',
          validation: {
            required: true,
          },
          conditionalDisplay: [
            {
              field: 'breach-of-tenancy',
              is: 'yes',
            },
          ],
        },
      ],
    },
  ],
  conditionals: [
    {
      fieldId: 'breach-of-tenancy',
      value: 'yes',
      nextFormId: FormID.LEGAL_RESTRICTIONS,
    },
    {
      fieldId: 'breach-of-tenancy',
      value: 'no',
      nextFormId: FormID.LEGAL_RESTRICTIONS,
    },
  ],
};
export default breachOfTenancy;
