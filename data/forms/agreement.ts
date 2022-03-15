import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const agreement: MultiStepForm = {
  id: FormID.AGREEMENT,
  steps: [
    {
      fields: [
        {
          as: 'checkbox',
          initialValue: false,
          label: 'I understand and accept',
          name: 'agreement',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};
export default agreement;
