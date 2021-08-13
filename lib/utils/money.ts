import { FormID } from './form-data';

interface IncomeInterface {
  heading: string;
  sections: Sections[];
}

interface Sections {
  heading: string;
  id: FormID;
}

export const Income: IncomeInterface = {
  heading: 'Money',
  sections: [
    {
      heading: 'Income and savings',
      id: FormID.INCOME_SAVINGS,
    },
    {
      heading: 'Employment',
      id: FormID.EMPLOYMENT,
    },
  ],
};
