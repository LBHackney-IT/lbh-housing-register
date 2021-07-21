import { FormID } from '../utils/form-data';

export type ApplicationStep = {
  heading: string;
  id: FormID;
};

export type ApplicationSteps = {
  steps: ApplicationStep[];
  heading: string;
};
