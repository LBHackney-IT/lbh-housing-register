import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const declaration: MultiStepForm = {
  id: FormID.DECLARATION,
  steps: [
    {
      fields: [
        {
          as: 'checkbox',
          initialValue: false,
          label: 'I agree',
          name: 'declaration',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};
export default declaration;
