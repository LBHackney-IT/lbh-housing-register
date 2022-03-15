import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const relationshipBreakdown: MultiStepForm = {
  id: FormID.RELATIONSHIP_BREAKDOWN,
  eligibility: [
    {
      field: 'relationship-breakdown',
      is: 'no',
      reasoning: 'ownOrSoldProperty',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Was this due to a relationship breakdown?',
          name: 'relationship-breakdown',
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
      fieldId: 'relationship-breakdown',
      value: 'yes',
      nextFormId: FormID.ARREARS,
    },
    {
      fieldId: 'relationship-breakdown',
      value: 'no',
      nextFormId: 'exit',
    },
  ],
};

export default relationshipBreakdown;
