import { MultiStepForm } from '../../lib/types/form';
import { FormID } from '../../lib/utils/form-data';

const immigrationStatus: MultiStepForm = {
  id: FormID.IMMIGRATION_STATUS,
  heading: 'Immigration status',
  eligibility: [
    {
      field: 'uk-studying',
      isNot: 'yes',
      reasoning: 'inUkToStudy',
    },
    {
      field: 'work-or-study-visa',
      isNot: 'yes',
      reasoning: 'inUkOnVisa',
    },
    {
      field: 'settled-status',
      isNot: 'no',
      reasoning: 'notGrantedSettledStatus',
    },
    {
      field: 'receiving-sponsorship',
      isNot: 'yes',
      reasoning: 'sponseredToStayInUk',
    },
    {
      field: 'legal-status',
      isNot: 'limited-leave-to-remain-no-public-funds',
      reasoning: 'limitedLeaveToRemainInUk',
    },
  ],
  steps: [
    {
      fields: [
        {
          as: 'radios',
          label: 'What citizenship do you hold?',
          name: 'citizenship',
          options: [
            {
              label: 'I am a British citizen',
              value: 'british',
            },
            {
              label: 'I am an EEA citizen',
              value: 'european',
            },
            {
              label: 'I have another citizenship',
              value: 'other',
            },
          ],
          validation: {
            required: true,
          },
        },
        {
          as: 'radios',
          label: 'Are you in the UK to study?',
          name: 'uk-studying',
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
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'european',
            },
          ],
        },
        {
          as: 'radios',
          label: 'Have you been granted settled status or pre-settled status?',
          details: {
            content:
              'Pre settled status means a person is granted permission to remain in the UK for five years. Settled status means a person is granted indefinite permission to remain in the UK.',
          },
          name: 'settled-status',
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
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'european',
            },
            {
              field: 'uk-studying',
              is: 'no',
            },
          ],
        },
        {
          as: 'radios',
          label: 'Do you have a work or study visa?',
          name: 'work-or-study-visa',
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
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'other',
            },
          ],
        },
        {
          as: 'radios',
          label: 'Are you a family member of an EEA national?',
          name: 'eea-national',
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
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'other',
            },
            {
              field: 'work-or-study-visa',
              is: 'no',
            },
          ],
        },
        {
          as: 'radios',
          label: 'Are you receiving sponsorship to stay in the UK?',
          name: 'receiving-sponsorship',
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
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'other',
            },
            {
              field: 'work-or-study-visa',
              is: 'no',
            },
            {
              field: 'eea-national',
              is: 'no',
            },
          ],
        },
        {
          as: 'radios',
          label: 'What is your legal status?',
          name: 'legal-status',
          options: [
            {
              label: 'I have Indefinite Leave to Remain',
              value: 'indefinite-leave-to-remain',
            },
            {
              label: 'I have Discretionary Leave to Remain',
              value: 'discretionary-leave-to-remain',
            },
            {
              label: 'I have Exceptional Leave to Remain',
              value: 'exceptional-leave-to-remain',
            },
            {
              label: 'I have been granted refugee status',
              value: 'refugee-status',
            },
            {
              label: 'I have been granted humanitarian protection',
              value: 'humanitarian-protection',
            },
            {
              label:
                'I have limited Leave to Remain with no recourse to public funds',
              value: 'limited-leave-to-remain-no-public-funds',
            },
            {
              label: 'Other',
              value: 'other',
            },
          ],
          validation: {
            required: true,
          },
          conditionalDisplay: [
            {
              field: 'citizenship',
              is: 'other',
            },
            {
              field: 'work-or-study-visa',
              is: 'no',
            },
            {
              field: 'eea-national',
              is: 'no',
            },
            {
              field: 'receiving-sponsorship',
              is: 'no',
            },
          ],
        },
      ],
    },
  ],
};

export default immigrationStatus;
