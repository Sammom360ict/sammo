export interface IUpdateProfilePayload {
  username?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  email?: string;
  password_hash?: string;
  phone_number?: string;
  photo?: string;
  role_id?: number;
  status?: boolean;
}

export interface IAdminSearchQuery {
  email?: string;
  id?: number;
  phone_number?: string;
  username?: string;
}

export interface IAdminCreatePayload {
  username: string;
  first_name: string;
  last_name: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  password_hash: string;
  phone_number: string;
  photo?: string;
  role_id: number;
  created_by: number;
}

export interface IGetAdminListFilterQuery {
  filter?:string;
  role?:number;
  limit?:number;
  skip?:number;
  status?:string;
}
