export interface StaffUser {
  sub: string;
  email: string;
  iss: string;
  name: string;
  groups: string[];
  iat: number;
}
