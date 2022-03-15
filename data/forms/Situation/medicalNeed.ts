import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const medicalNeed: MultiStepForm = {
  id: FormID.MEDICAL_NEED,
  eligibility: [
    {
      field: 'medical-need',
      is: 'no',
      reasoning: 'ownOrSoldProperty',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label:
            'Does anyone in your household have any significant medical conditions that affect the type of housing you need?',
          name: 'medical-need',
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
      fieldId: 'medical-need',
      value: 'yes',
      nextFormId: FormID.PURCHASING_PROPERTY,
    },
    {
      fieldId: 'medical-need',
      value: 'no',
      nextFormId: 'exit',
    },
  ],
};

export default medicalNeed;
