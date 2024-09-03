import { ILegDescription } from "./flightSearchResInterface";

export interface IFlightFilterQuery {
  carrier_operating?: string | undefined;
  min_price?: string | undefined;
  max_price?: string | undefined;
  page?: string | undefined;
  size?: string | undefined;
  refundable?: string | undefined;
  stoppage?: string | undefined;
  aircraft?: string | undefined;
  elapsed_time_min?: string | undefined;
  departure_timing?: string | undefined;
  arrival_timing?: string | undefined;
  sort_by?: string | undefined;
  baggage?: string | undefined;
  min_departure_time?: string | undefined;
  max_departure_time?: string | undefined;
  min_arrival_time?: string | undefined;
  max_arrival_time?: string | undefined;
}

export interface IFlightSearchReqBody {
  OriginDestinationInformation: OriginDestinationInformation[];
  PassengerTypeQuantity: PassengerTypeQuantity[];
}

interface IFlightReqBody {
  departure_time: string;
  departure_date: string;
  arrival_time: string;
  arrival_date: string;
  carrier_marketing_flight_number: number;
  departure_airport_code: string;
  arrival_airport_code: string;
  carrier_marketing_code: string;
  carrier_operating_code: string;
}

interface IOriginDestinationInformationReqBody {
  RPH: string;
  DepartureDateTime: string;
  OriginLocation: OriginLocation;
  DestinationLocation: DestinationLocation;
  flight: IFlightReqBody[];
}

export interface IFlightRevalidateReqBody {
  OriginDestinationInformation: IOriginDestinationInformationReqBody[];
  PassengerTypeQuantity: PassengerTypeQuantity[];
}

export interface OriginDestinationInformation {
  RPH: string;
  DepartureDateTime: string;
  OriginLocation: OriginLocation;
  DestinationLocation: DestinationLocation;
  TPA_Extensions: TpaExtensions;
}

export interface OriginLocation {
  LocationCode: string;
}

export interface DestinationLocation {
  LocationCode: string;
}

export interface TpaExtensions {
  CabinPref: CabinPref;
}

export interface CabinPref {
  Cabin: string;
  PreferLevel: string;
}

export interface PassengerTypeQuantity {
  Code: string;
  Quantity: number;
}

export interface IResponse {
  version: string;
  statistics: { itineraryCount: number };
  scheduleDescs: IScheduleDecs[];
  taxDescs: ITaxDesc[];
  taxSummaryDescs: ITaxSummaryDecs[];
  fareComponentDescs: IFareComponentDescs[];
  baggageAllowanceDescs:
    | IBaggageAllowanceDescs[]
    | IBaggageAllowanceDescsInternational[];
  legDescs: ILegDescs[];
  itineraryGroups: IItineraryGroups[];
}

interface IItineraries {
  id: number;
  pricingSource: string;
  legs: Leg[];
  pricingInformation: PricingInformation[];
  diversitySwapper: DiversitySwapper;
}
interface DiversitySwapper {
  weighedPrice: number;
}
interface PricingInformation {
  pricingSubsource: string;
  fare: Fare;
}
interface Fare {
  validatingCarrierCode: string;
  vita: boolean;
  eTicketable: boolean;
  lastTicketDate: string;
  lastTicketTime: string;
  governingCarriers: string;
  passengerInfoList: PassengerInfoList[];
  totalFare: TotalFare;
}
interface TotalFare {
  totalPrice: number;
  totalTaxAmount: number;
  baseFareAmount: number;
  baseFareCurrency: string;
  equivalentAmount: number;
  equivalentCurrency: string;
  ait?: number;
  discountAmount?: number;
  payableAmount: number;
}

interface PassengerInfoList {
  passengerInfo: PassengerInfo;
}
interface PassengerInfo {
  passengerType: string;
  passengerNumber: number;
  nonRefundable: boolean;
  fareComponents: FareComponent[];
  taxes: Leg[];
  taxSummaries: Leg[];
  currencyConversion: CurrencyConversion;
  passengerTotalFare: PassengerTotalFare;
  baggageInformation: BaggageInformation[];
}
interface BaggageInformation {
  provisionType: string;
  airlineCode: string;
  segments: Segment3[];
  allowance: Leg;
}
interface Segment3 {
  id: number;
}
interface PassengerTotalFare {
  totalFare: number;
  totalTaxAmount: number;
  currency: string;
  baseFareAmount: number;
  baseFareCurrency: string;
  equivalentAmount: number;
  equivalentCurrency: string;
  constructionAmount: number;
  constructionCurrency: string;
  commissionPercentage: number;
  commissionAmount: number;
  exchangeRateOne: number;
}
interface CurrencyConversion {
  from: string;
  to: string;
  exchangeRateUsed: number;
}
interface FareComponent {
  ref: number;
  beginAirport: string;
  endAirport: string;
  segments: Segment2[];
}
interface Segment2 {
  segment: Segment;
}
interface Segment {
  bookingCode: string;
  cabinCode: string;
  mealCode?: string;
  seatsAvailable: number;
  availabilityBreak: boolean;
  fareBreakPoint: boolean;
}
interface Leg {
  ref: number;
}

interface IGroupDescription {
  legDescriptions: LegDescription[];
}
interface LegDescription {
  departureDate: string;
  departureLocation: string;
  arrivalLocation: string;
}

interface IItineraryGroups {
  groupDescription: IGroupDescription;
  itineraries: IItineraries[];
}

interface IBaggageAllowanceDescs {
  id: number;
  weight: number;
  unit: string;
}
interface IBaggageAllowanceDescsInternational {
  id: number;
  pieceCount: number;
}

interface ILegDescs {
  id: number;
  elapsedTime: number;
  schedules: Schedule[];
}
interface Schedule {
  ref: number;
  departureDateAdjustment?: number;
}

interface IFareComponentDescs {
  id: number;
  governingCarrier: string;
  fareAmount: number;
  fareCurrency: string;
  fareBasisCode: string;
  farePassengerType: string;
  ticketDesignator?: string;
  publishedFareAmount: number;
  oneWayFare: boolean;
  directionality: string;
  direction: string;
  notValidAfter: string;
  privateFare?: boolean;
  applicablePricingCategories: string;
  vendorCode: string;
  fareTypeBitmap: string;
  fareType: string;
  fareTariff: string;
  fareRule: string;
  cabinCode: string;
  segments: FareSegment2[];
}
interface FareSegment2 {
  segment: FareSegment;
}
interface FareSegment {}
interface ITaxSummaryDecs {
  id: number;
  code: string;
  amount: number;
  currency: string;
  description: string;
  publishedAmount: number;
  publishedCurrency: string;
  station: string;
  country?: string;
}

interface ITaxDesc {
  id: number;
  code: string;
  amount: number;
  currency: string;
  description: string;
  publishedAmount: number;
  publishedCurrency: string;
  station: string;
  country?: string;
}

interface IScheduleDecs {
  id: number;
  frequency: string;
  stopCount: number;
  eTicketable: boolean;
  totalMilesFlown: number;
  elapsedTime: number;
  departure: Departure;
  arrival: Arrival;
  carrier: Carrier;
}

interface Departure {
  airport: string;
  city: string;
  country: string;
  time: string;
  terminal: string;
}

interface Arrival {
  airport: string;
  city: string;
  country: string;
  time: string;
}

interface Carrier {
  marketing: string;
  marketingFlightNumber: number;
  operating: string;
  operatingFlightNumber: number;
  equipment: Equipment;
}

interface Equipment {
  code: string;
  typeForFirstLeg: string;
  typeForLastLeg: string;
}

interface IOriginDest {
  RPH: string;
  DepartureDateTime: string;
  OriginLocation: OriginLocation;
  DestinationLocation: OriginLocation;
  TPA_Extensions: TPAExtensions;
}
interface TPAExtensions {
  CabinPref: CabinPref;
}

export interface IUpdatedSchedules {
  id: number;
  eTicketable: boolean;
  elapsedTime: number;
  frequency: string;
  stopCount: number;
  totalMilesFlown: number;
  departure_airport: string;
  departure_city: string;
  departure_country: string;
  departure_terminal: string;
  departure_time: string;
  arrival_airport: string;
  arrival_city: string;
  arrival_country: string;
  arrival_time: string;
  carrier_equipment: CarrierEquipment;
  carrier_marketing: string;
  carrier_marketingFlightNumber: number;
  carrier_operating: string;
  carrier_operatingFlightNumber: number;
}
interface CarrierEquipment {
  code: string;
  typeForFirstLeg: string;
  typeForLastLeg: string;
}

export interface ILowFareBody {
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
}

export interface ISecureFlight {
  PersonName: {
    NameNumber: string;
    DateOfBirth: string;
    Gender: string;
    GivenName: string;
    Surname: string;
  };
  SegmentNumber: string;
  VendorPrefs: {
    Airline: {
      Hosted: boolean;
    };
  };
}

export interface IContactNumber {
  NameNumber: string;
  Phone: string;
  PhoneUseType: "H";
}

// insert flight search =======================================================
export interface IinsertflightSearch {
  agency_id: number;
  user_id: number;
  search_data: string;
  departure_date_time: string;
}

// Flight search result interfaces
export interface IDeparture {
  airport: string;
  city: string;
  airport_code: string;
  city_code: string;
  country: string;
  terminal: string | undefined;
  time: string;
  date: string | Date;
  date_adjustment: number | undefined;
}

export interface IArrival {
  airport: string;
  airport_code: string;
  city_code: string;
  city: string;
  country: string;
  time: string;
  terminal: string | undefined;
  date: string | Date;
  date_adjustment: number | undefined;
}

export interface ICarrier {
  carrier_marketing_code: string;
  carrier_marketing_airline: string;
  carrier_marketing_logo: string;
  carrier_marketing_flight_number: number;
  carrier_operating_code: string;
  carrier_operating_airline: string;
  carrier_operating_logo: string;
  carrier_operating_flight_number: number;
  carrier_aircraft_code: string;
  carrier_aircraft_name: string;
}

export interface IScheduleDesc {
  id: number;
  e_ticketable: boolean;
  elapsedTime: number;
  stopCount: number;
  total_miles_flown: number;
  message?: string;
  message_type?: string;
  departure: IDeparture;
  arrival: IArrival;
  carrier: ICarrier;
}

export interface ILegDescOption extends IScheduleDesc {
  departureDateAdjustment: number | undefined;
}

export interface ILegDesc {
  id: number;
  options: ILegDescOption[];
}

export interface IFlightOption extends IScheduleDesc {
  departure_date: Date;
  arrival_date: Date;
  departure_time: string;
  arrival_time: string;
}

export interface INewLegDesc {
  id: number;
  options: IFlightOption[];
  layover_time: number[];
}

export interface INewFare {
  commission: number;
  base_fare: number;
  discount: number;
  ait: number;
  payable: number;
  total_price: number;
  total_tax: number;
}

export interface INewPassengerFacilities {
  id: number;
  from_airport: string;
  to_airport: string;
  segments: {
    id: number;
    meal_code: string | undefined;
    meal_type: string | undefined;
    cabin_code: string | undefined;
    cabin_type: string | undefined;
    booking_code: string | undefined;
    available_seat: string | undefined;
    available_break: boolean | null;
    available_fare_break: boolean | null;
  }[];
  baggage: {
    id: number | null;
    unit: string | null;
    count: string | null;
  };
}

export interface INewPassenger {
  type: string;
  number: number;
  non_refundable: boolean;
  availability: INewPassengerFacilities[];
  fare: {
    total_fare: number;
    tax: number;
    base_fare: number;
  };
}

export interface IItinerary {
  flight_id?: string;
  fare: INewFare;
  carrier_code: string;
  carrier_name: string;
  carrier_logo: string;
  ticket_last_date: string;
  ticket_last_time: string;
  refundable: { type: string; refundable: boolean }[];
  // flight_class: {
  //   type: string;
  //   cabin_type: string | undefined;
  //   booking_code: string | undefined;
  // }[];
  leg_descriptions: ILegDescription[];
  flights: INewLegDesc[];
  passengers: INewPassenger[];
}
