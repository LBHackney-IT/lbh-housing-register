import { FormID } from '../utils/form-data';

export type ApplicationSection = {
  heading: string;
  id: FormID;
};

export type ApplicationSectionGroup = {
  sections: ApplicationSection[];
  heading: string;
};
