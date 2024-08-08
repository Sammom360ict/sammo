export interface IProfile {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: 'Male' | 'Female' | 'Other';
  email?: string;
  phone_number?: string;
  photo?: string;
}

export interface IChangePasswordPayload {
  old_password: string;
  new_password: string;
}
