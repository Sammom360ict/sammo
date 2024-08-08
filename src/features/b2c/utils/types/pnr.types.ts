export interface IPnrRequestBody {
    flight_id: string;
    passengers: Passenger[];
  }
  
  export interface Passenger {
    passport_file?: string;
    visa_file?: string;
    type: string;
    reference: string;
    mid_name: string;
    sur_name: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    email: string;
    address: string;
    post_code: string;
    city: string;
    country: string;
    passport_expiry_date?: string;
    documentNumber?: string;
    issuingCountryCode?: string;
    residenceCountryCode?: string;
    frequent_flyer_number?: string;
    save_information?:boolean;
  }