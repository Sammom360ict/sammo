export interface IInsertBookingRequestPayload {
    user_id: number;
    commission: number;
    total_price: number;
    base_fair: number;
    total_tax: number;
    discount: number;
    payable:number;
    currency?: number;
    journey_type?: string;
    total_travelers: number;
    traveler_adult?: number;
    traveler_children?: number;
    traveler_kids?: number;
    traveler_infants?: number;
    ait?: number;
    extra_added?: number;
    origin: string;
    destination: string;
  }
  
  export interface IGetBookingRequestParams {
    status?: string;
    user_name?: string;
    limit?: string;
    skip?: string;
    from_date?: string;
    to_date?: string;
    user_id?:number;
  }
  
  export interface IGetSingleBookingRequestParams {
    id?: number;
    user_id?: number;
  }
  
  export interface IInsertBookingRequestSegment {
    booking_request_id: number;
    flight_number: string;
    airline: string;
    airline_code: string;
    airline_logo: string;
    origin: string;
    destination: string;
    class: string;
    baggage: string;
    departure_date: string;
    departure_time: string;
    arrival_date: string;
    arrival_time: string;
  }
  
  export interface IInsertBookingRequestTravelerPayload{
    booking_request_id: number;
    type: string;
    title: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    passport_number?: string;
    passport_expiry_date?: Date;
    city_id: number;
    email: string;
    phone: string;
    frequent_flyer_airline?: string;
    frequent_flyer_number?: string;
  }