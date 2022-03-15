import { MultiStepForm } from '../types/form';
import { FormID } from './form-data';

type EthnicityObject = {
  label: string;
  value?: string;
  category: string;
};

export const ethnicityCategoryOptions = [
  {
    label: 'Indian',
    value: 'indian',
    category: 'asian-asian-british',
  },
  {
    label: 'Pakistani',
    value: 'pakistani',
    category: 'asian-asian-british',
  },
  {
    label: 'Bangladeshi',
    value: 'bangladeshi',
    category: 'asian-asian-british',
  },
  {
    label: 'Chinese',
    value: 'chinese',
    category: 'asian-asian-british',
  },
  {
    label: 'Nepali',
    value: 'nepali',
    category: 'asian-asian-british',
  },
  {
    label: 'Sri Lankan Sinhalese',
    value: 'sri-lankan-sinhalese',
    category: 'asian-asian-british',
  },
  {
    label: 'Sri Lankan Tamil',
    value: 'sri-lankan-tamil',
    category: 'asian-asian-british',
  },
  {
    label: 'Sri Lankan other',
    value: 'sri-lankan-other',
    category: 'asian-asian-british',
  },
  {
    label: 'Vietnamese',
    value: 'vietnamese',
    category: 'asian-asian-british',
  },
  {
    label: 'Other Asian',
    value: 'other-asian',
    category: 'asian-asian-british',
  },
  {
    label: 'Black Caribbean',
    value: 'black-caribbean',
    category: 'black-black-british',
  },
  {
    label: 'Black British',
    value: 'black-british',
    category: 'black-black-british',
  },
  {
    label: 'Black - Angolan',
    value: 'black-angolan',
    category: 'black-black-british',
  },
  {
    label: 'Black - Congolese',
    value: 'black-congolese',
    category: 'black-black-british',
  },
  {
    label: 'Black - Ghanaian',
    value: 'black-ghanaian',
    category: 'black-black-british',
  },
  {
    label: 'Black - Nigerian',
    value: 'black-nigerian',
    category: 'black-black-british',
  },
  {
    label: 'Black - Sierra Leonean',
    value: 'black-sierra-leonean',
    category: 'black-black-british',
  },
  {
    label: 'Black - Somali',
    value: 'black-somali',
    category: 'black-black-british',
  },
  {
    label: 'Black - Sudanese',
    value: 'black-sudanese',
    category: 'black-black-british',
  },
  {
    label: 'Other Black African',
    value: 'other-black-african',
    category: 'black-black-british',
  },
  {
    label: 'White and Black Caribbean',
    value: 'white-and-black-caribbean',
    category: 'mixed-multiple-background',
  },
  {
    label: 'White and Black African',
    value: 'white-and-black-african',
    category: 'mixed-multiple-background',
  },
  {
    label: 'White and Asian',
    value: 'white-and-asian',
    category: 'mixed-multiple-background',
  },
  {
    label: 'Any other mixed background',
    value: 'any-other-mixed-background',
    category: 'mixed-multiple-background',
  },
  {
    label: 'Arab',
    value: 'arab',
    category: 'other-ethnic-group',
  },
  {
    label: 'Afghan',
    value: 'afghan',
    category: 'other-ethnic-group',
  },
  {
    label: 'Egyptian',
    value: 'egyptian',
    category: 'other-ethnic-group',
  },
  {
    label: 'Filipino',
    value: 'filipino',
    category: 'other-ethnic-group',
  },
  {
    label: 'Iranian',
    value: 'iranian',
    category: 'other-ethnic-group',
  },
  {
    label: 'Iraqi',
    value: 'iraqi',
    category: 'other-ethnic-group',
  },
  {
    label: 'Japanese',
    value: 'japanese',
    category: 'other-ethnic-group',
  },
  {
    label: 'Korean',
    value: 'korean',
    category: 'other-ethnic-group',
  },
  {
    label: 'Kurdish',
    value: 'kurdish',
    category: 'other-ethnic-group',
  },
  {
    label: 'Latin/South/ Central American',
    value: 'latin-south-central-american',
    category: 'other-ethnic-group',
  },
  {
    label: 'Lebanese',
    value: 'lebanese',
    category: 'other-ethnic-group',
  },
  {
    label: 'Libyan',
    value: 'libyan',
    category: 'other-ethnic-group',
  },
  {
    label: 'Malay',
    value: 'malay',
    category: 'other-ethnic-group',
  },
  {
    label: 'Moroccan',
    value: 'moroccan',
    category: 'other-ethnic-group',
  },
  {
    label: 'Polynesian',
    value: 'polynesian',
    category: 'other-ethnic-group',
  },
  {
    label: 'Thai',
    value: 'thai',
    category: 'other-ethnic-group',
  },
  {
    label: 'Turkish',
    value: 'turkish',
    category: 'other-ethnic-group',
  },
  {
    label: 'Vietnamese',
    value: 'vietnamese',
    category: 'other-ethnic-group',
  },
  {
    label: 'Yemeni',
    value: 'yemeni',
    category: 'other-ethnic-group',
  },
  {
    label: 'Gypsy Roma',
    value: 'gypsy-roma',
    category: 'other-ethnic-group',
  },
  {
    label: 'Other European',
    value: 'other-european',
    category: 'other-ethnic-group',
  },
  {
    label: 'White - British',
    value: 'white-british',
    category: 'white',
  },
  {
    label: 'White - Irish',
    value: 'white-irish',
    category: 'white',
  },
  {
    label: 'Gypsy or Irish Traveller',
    value: 'gypsy-or-irish-traveller',
    category: 'white',
  },
  {
    label: 'White - Australian / New Zealander',
    value: 'white-australian-new-zealander ',
    category: 'white',
  },
  {
    label: 'White - Charedi Jew',
    value: 'white-charedi-jew',
    category: 'white',
  },
  {
    label: 'White - Italian',
    value: 'white-italian',
    category: 'white',
  },
  {
    label: 'White - Greek Cypriot',
    value: 'white-greek-cypriot',
    category: 'white',
  },
  {
    label: 'White - North American',
    value: 'white-north-american ',
    category: 'white',
  },
  {
    label: 'White - Other Eastern European',
    value: 'white-other-eastern-european',
    category: 'white',
  },
  {
    label: 'White - Other Western European',
    value: 'white-other-western-european',
    category: 'white',
  },
  {
    label: 'White - Polish',
    value: 'white-polish',
    category: 'white',
  },
  {
    label: 'White - Turkish',
    value: 'white-turkish ',
    category: 'white',
  },
  {
    label: 'White - Turkish Cypriot',
    value: 'white-turkish-cypriot',
    category: 'white',
  },
  {
    label: 'White Other',
    value: 'White-other',
    category: 'white',
  },
];

const ethnicityCategoryQuestions = [
  {
    label:
      'Which of the following best describes your Asian or Asian British background?',
    category: 'asian-asian-british',
  },
  {
    label:
      'Which of the following best describes your Black or Black British background?',
    category: 'black-black-british',
  },
  {
    label: 'Which of the following best describes your ethnic background?',
    category: 'other-ethnic-group',
  },
  {
    label: 'Which of the following best describes your white background?',
    category: 'white',
  },
  {
    label:
      'Which of the following best describes your Mixed or Multiple background background?',
    category: 'mixed-multiple-background',
  },
];

function makeEthnicityForm(category: string): MultiStepForm {
  const ethnicityFilter = (ethnicity: EthnicityObject) =>
    ethnicity.category === category;

  const ethnicityQuestion =
    ethnicityCategoryQuestions.filter(ethnicityFilter)[0].label;
  const matchingOptions = ethnicityCategoryOptions
    .filter(ethnicityFilter)
    .map((option) => ({
      label: option.label,
      value: option.value,
    }));

  return {
    id: `ethnicity-extended-category-${category}` as FormID,
    steps: [
      {
        fields: [
          {
            as: 'radios',
            label: ethnicityQuestion,
            name: 'ethnicity-extended-category',
            options: matchingOptions,
            validation: {
              required: true,
            },
          },
        ],
      },
    ],
  };
}

export const ethnicCategoryAsianAsianBritishForm = makeEthnicityForm(
  'asian-asian-british'
);
export const ethnicCategoryBlackBlackBritishForm = makeEthnicityForm(
  'black-black-british'
);
export const ethnicCategoryMixedMultipleBackgroundForm = makeEthnicityForm(
  'mixed-multiple-background'
);
export const ethnicCategoryWhiteForm = makeEthnicityForm('white');
export const ethnicCategoryOtherEthnicGroupForm =
  makeEthnicityForm('other-ethnic-group');
