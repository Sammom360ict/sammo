interface IVisaType {
    type: 'Student' | 'Government Delegates' | 'Business' | 'Tourist' | 'Investor' | 'Work';
}

export interface ICreateVisaPayload {
    country_id: number;
    visa_fee: number;
    processing_fee: number;
    max_validity: number;
    type: IVisaType;
    created_by: number;
    description?: string;
    stay_validity: number;
    visa_mode?: string;
    processing_type?: string;
    documents_details?: string;
}

export interface IGetVisaQuery {
    country_id?: number;
    status?: boolean;
    limit?: number;
    skip?: number;
}

export interface IUpdateVisaPayload {
    country_id?: number;
    visa_fee?: number;
    processing_fee?: number;
    max_validity?: number;
    type?: IVisaType;
    description?: string;
    stay_validity?: number;
    visa_mode?: string;
    processing_type?: string;
    documents_details?: string;
    status?: boolean;
}


//application
export interface ICreateB2CApplicationPayload {
    user_id: number;
    visa_id: number;
    from_date: Date;
    to_date: Date;
    traveler: number;
    visa_fee: number;
    processing_fee: number;
    payable: number;
    application_date: Date;
    contact_email: string;
    contact_number: string;
    whatsapp_number?: string;
    nationality: string;
    residence: string;
}

export interface ICreateB2BApplicationPayload {
    agency_id: number;
    agent_id: number;
    visa_id: number;
    from_date: Date;
    to_date: Date;
    traveler: number;
    visa_fee: number;
    processing_fee: number;
    payable: number;
    application_date: Date;
    contact_email: string;
    contact_number: string;
    whatsapp_number?: string;
    nationality: string;
    residence: string;
}

export interface ICreateAppTravelerPayload {
    application_id: number;
    type: string;
    title: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    passport_number: string;
    passport_expiry_date: Date;
    city?: string;
    country_id?: number;
    address?: string;
    passport_type?: 'Ordinary' | 'Diplomatic' | 'Official';
}

export interface ICreateAppTrackingPayload {
    application_id: number;
    status: string;
    details: string;
}

export interface IGetApplicationQuery {
    limit?: number;
    skip?: number;
    user_id?: number;
    filter?: string;
    from_date?: Date;
    to_date?: Date;
}
export interface IGetB2BApplicationQuery {
    limit?: number;
    skip?: number;
    agent_id?: number;
    filter?: string;
    from_date?: Date;
    to_date?: Date;
}