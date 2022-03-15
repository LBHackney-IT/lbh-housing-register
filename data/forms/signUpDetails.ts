import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const signUpDetails: MultiStepForm = {
  id: FormID.SIGN_UP_DETAILS,
  steps: [
    {
      fields: [
        {
          as: 'select',
          label: 'Title',
          name: 'title',
          options: [
            {
              label: 'Select an option',
              value: '',
            },
            {
              label: 'Mr',
              value: 'Mr',
            },
            {
              label: 'Mrs',
              value: 'Mrs',
            },
            {
              label: 'Miss',
              value: 'Miss',
            },
            {
              label: 'Ms',
              value: 'Ms',
            },
            {
              label: 'Mx',
              value: 'Mx',
            },
            {
              label: 'Other',
              value: 'Other',
            },
          ],
        },
        {
          label: 'First name',
          name: 'firstName',
          validation: {
            required: true,
          },
        },
        {
          label: 'Last name',
          name: 'surname',
          validation: {
            required: true,
          },
        },
        {
          as: 'dateinput',
          label: 'Date of birth',
          name: 'dateOfBirth',
          hint: 'For example, 31 3 1980',
          validation: {
            required: true,
          },
        },
        {
          as: 'radioconditional',
          label: 'Gender',
          name: 'gender',
          options: [
            {
              label: 'Male',
              value: 'M',
            },
            {
              label: 'Female',
              value: 'F',
            },
            {
              label: 'Prefer to self-describe',
              value: 'self',
              conditionalFieldInput: {
                as: 'input',
                containerId: 'self-describe-text-values',
                fieldId: 'self-describe',
                fieldName: 'genderDescription',
                label: 'Please enter your self-description',
              },
            },
          ],
        },
        {
          label: 'National Insurance number',
          hint: 'For example, AB 12 34 56 C',
          name: 'nationalInsuranceNumber',
          validation: {
            required: true,
          },
        },
        {
          label: 'Mobile number',
          name: 'phoneNumber',
          type: 'text',
          validation: {
            required: true,
          },
        },
      ],
    },
  ],
};

export default signUpDetails;
