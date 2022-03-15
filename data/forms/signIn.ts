import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const signIn: MultiStepForm = {
  id: FormID.SIGN_IN,
  steps: [
    {
      fields: [
        {
          label: 'Email',
          name: 'emailAddress',
          type: 'email',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};

export default signIn;
