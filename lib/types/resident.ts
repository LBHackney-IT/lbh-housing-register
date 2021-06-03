import { FormData } from './form';

export interface Resident {
  formData: { [key: string]: FormData };
  ineligibilityReasons?: string[];
  isEligible?: boolean;
  name: string;
  slug: string;
}

export interface MainResident extends Resident {
  hasAgreed: boolean;
  isLoggedIn: boolean;
  username: string;
}
