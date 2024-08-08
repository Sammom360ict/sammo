export interface OTPType {
  type: 'reset_user' | 'reset_admin' | 'verify_user';
}
export interface IInsertOTPPayload extends OTPType {
  hashed_otp: string;
  email?: string;
}

export interface IGetOTPPayload extends OTPType {
  email: string;
}

export interface ICreateAirportPayload{
  country_id:number;
  name:string;
  iata_code:string;
  city?: number;
}
export interface IUpdateAirportPayload{
  country_id?:number;
  name?:string;
  iata_code?:string;
  city?: number;
}

export interface ICreateAirlinesPayload{
  code:string;
  name:string;
  logo:string;
}
export interface IUpdateAirlinesPayload{
  code?:string;
  name?:string;
  logo?:string;
}
