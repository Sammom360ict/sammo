export interface IInsertFlightSegmentPayload {
    flight_booking_id:number;
    flight_number?:string;
    airline?: string;
    airline_code?:string;
    airline_logo?:string;
    origin?:string;
    destination?:string;
    class?:string;
    baggage?:string;
    departure_date?:string | Date;
    arrival_date?:string | Date;
    departure_time?:string;
    arrival_time?:string;
  }

  export interface IInsertFlightTravelerPayload{
    flight_booking_id:number;
    type?:string;
    reference?:string;
    mid_name?:string;
    sur_name?:string;
    phone?:string;
    date_of_birth?:Date;
    gender?:string;
    email?:string;
    passport_number?:string;
    passport_expiry_date?:Date;
    city?:string;
    country?:number;
  }

  export interface ICreateFlightBookingPayload {
    user_id: number;
    created_by: number;
    pnr_code: string;
    total_passenger: number;
    ticket_issue_last_time: string;
    ticket_price: number;
    base_fare: number;
    total_tax: number;
    commission: number;
    journey_type?: string;
    payable_amount: number;
    commission_per: number;
    ait?:number;
    discount?:number;
  }

  export interface IFlightTicketIssuePayload {
    flight_booking_id: number;
    traveler_given_name?: string;
    traveler_surname?: string;
    traveler_reference?: string;
    reservation_code?: string;
    date_issued?: string;
    ticket_number?: string;
    issuing_airline?: string;
    issuing_agent?: string;
    issuing_agent_location?: string;
    iata_number?: string;
    sub_total?: number;
    taxes?: number;
    total?: number;
    currency?: string;
    traveler_type?: string;
  }

export interface IFlightTicketIssueSegmentPayload {
    flight_booking_id: number;
    airline_name?: string;
    airline_code?: string;
    flight_number?: string;
    reservation_code?: string;
    departure_address?: string;
    departure_time?: string;
    departure_terminal?: string;
    arrival_address?: string;
    arrival_time?: string;
    arrival_terminal?: string;
    departure_date?: string;
    cabin_type?: string;
    cabin_code?: string;
    status?: string;
    fare_basis?: string;
    bags?: string;
    operated_by?: string;
    from_airport_code?: string;
    to_airport_code?:string;
    arrival_date?: string;
  }