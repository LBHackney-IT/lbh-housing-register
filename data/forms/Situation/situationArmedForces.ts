import { MultiStepForm } from '../../../lib/types/form';
import { FormID } from '../../../lib/utils/form-data';

const situationArmedForces: MultiStepForm = {
  id: FormID.SITUATION_ARMED_FORCES,
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'Have you or your partner ever served in the armed forces?',
          name: 'situation-armed-forces',
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
      fieldId: 'situation-armed-forces',
      value: 'yes',
      nextFormId: 'exit',
    },
    {
      fieldId: 'situation-armed-forces',
      value: 'no',
      routeSelect: true,
    },
  ],
};

export default situationArmedForces;
