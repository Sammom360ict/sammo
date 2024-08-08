export interface ICreateAgencyPayload {
    agency_logo?: string;
    agency_name: string;
    email: string;
    phone: string;
    commission?: number;
    created_by: number;
    ref_id?: number;
}

export interface ICreateAgencyUserPayload {
    agency_id: number;
    name: string;
    email: string;
    hashed_password: string;
    mobile_number: string;
    photo?: string;
}

export interface IInsertAgencyDepositPayload {
    agency_id: number;
    type: 'credit' | 'debit';
    amount: number;
    created_by?: number;
    details?: string;
}

export interface IGetAgentTransactionsParams {
    agency_id: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
    skip?: number;
    type?: string;
    search?: string;
}

export interface IInsertTravelerPayload {
    agency_id: number;
    first_name: string;
    sur_name: string;
    phone?: string;
    date_of_birth: string;
    gender?:string;
    email: string;
    type: string;
    passport_number?: string;
    passport_expire_date?: string;
    reference: string;
    country_id?:number;
    city?:string;
    frequent_flyer_airline?:string;
    frequent_flyer_number?:string;
  }