export interface IRegisterUser {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: "Male" | "Female" | "Other";
  email: string;
  password_hash?: string;
  phone_number?: string;
  photo?: string;
}

export interface IUpdateUserProfile {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: "Male" | "Female" | "Other";
  password_hash?: string;
  photo?: string;
  is_verified?: boolean;
  status?: boolean;
}

export interface IGetUserListFilter {
  filter?: string;
  status?: boolean;
  limit?: number;
  skip?: number;
}
