export interface IInsertBookingRequestPayload {
  user_id: number;
  commission_per?: number;
  commission: number;
  base_fare: number;
  total_tax: number;
  discount: number;
  payable_amount: number;
  ticket_price: number;
  journey_type?: string;
  ait?: number;
  total_passenger: number;
  created_by: number;
  ticket_issue_last_time: string;
}
export interface IGetBookingRequestParams {
  status?: string;
  user_name?: string;
  limit?: string;
  skip?: string;
  from_date?: string;
  to_date?: string;
  user_id?: number;
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
export interface IInsertBookingRequestTravelerPayload {
  booking_request_id: number;
  type?: string;
  reference?: string;
  mid_name?: string;
  sur_name?: string;
  phone?: string;
  date_of_birth?: Date;
  gender?: string;
  email?: string;
  passport_number?: string;
  passport_expiry_date?: Date;
  city?: string;
  country?: number;
}
