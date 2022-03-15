import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const signinVerify: MultiStepForm = {
  id: FormID.SIGN_IN_VERIFY,
  steps: [
    {
      fields: [
        {
          type: 'verifycode',
          label: 'Verification code',
          name: 'code',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};

export default signinVerify;
