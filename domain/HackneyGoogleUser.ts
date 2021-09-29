export interface HackneyGoogleUser {
  name: string;
  email: string;
  groups: string[];
  hasAnyPermissions: boolean;
  hasAdminPermissions: boolean;
  hasManagerPermissions: boolean;
  hasOfficerPermissions: boolean;
}
