import { Knex } from "knex";

// Db or Transaction connection types
export type TDB = Knex | Knex.Transaction;

// user admin types
export interface IAdmin {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone_number: string;
  photo: string | null;
  status: boolean;
  role_id: number;
}

export interface IB2BAgencyUser {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  photo: string;
  user_status: boolean;
  agency_id: number;
  agency_logo: string;
  agency_name: string;
  agency_status: boolean;
}

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  email: string;
  phone_number: string;
  photo: string | null;
  status: boolean;
}

// login interface
export interface ILoginPayload {
  email: string;
  password: string;
  institute_id: number;
}

//forget pass
export interface IForgetPasswordPayload {
  token: string;
  email: string;
  password: string;
}

export interface IPromiseRes<T> {
  success: boolean;
  message?: string;
  code: number;
  data?: T;
}

export interface IAirportFilterQuery {
  country_id?: number;
  name?: string;
  limit?: number;
  skip?: number;
}
export interface IAirlineFilterQuery {
  code?: string;
  name?: string;
  limit?: number;
  skip?: number;
}

export interface IVisaFilterQuery {
  country_id?: number;
  limit?: number;
  skip?: number;
}
