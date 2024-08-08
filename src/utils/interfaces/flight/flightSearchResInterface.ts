export interface IFlightSearchRes {
  version: string;
  statistics: {
    itineraryCount: number;
  };
  scheduleDescs: scheduleDescs[];
  taxDescs: ITaxDesc[];
  taxSummaryDescs: ITaxSummeryDesc[];
  obFeeDescs?: IObFeeDesc[];
  fareComponentDescs: IFareComponentDesc[];
  baggageAllowanceDescs: IBaggageAllowanceDesc[];
  legDescs: ILegDesc[];
  itineraryGroups: IItineraryGroup[];
}

interface IItineraryGroup {
  groupDescription: IGroupDescription;
  itineraries: IItinerary[];
}

interface IGroupDescription {
  legDescriptions: ILegDescription[];
}

export interface ILegDescription {
  departureDate: string;
  departureLocation: string;
  arrivalLocation: string;
}

interface IItinerary {
  id: number;
  pricingSource: string;
  legs: { ref: number }[];
  pricingInformation: IPricingInformation[];
  diversitySwapper: {
    weighedPrice: number;
  };
}

interface IPricingInformation {
  pricingSubsource: string;
  fare: {
    validatingCarrierCode: string;
    vita: boolean;
    eTicketable: boolean;
    lastTicketDate: string;
    lastTicketTime: string;
    governingCarriers: string;
    passengerInfoList: IPassengerInfoList[];
    totalFare: ITotalFare;
  };
}

interface IPassengerInfoList {
  passengerInfo: {
    passengerType: string;
    passengerNumber: number;
    nonRefundable: boolean;
    fareComponents: IFareComponents[];
    taxes: ITaxes[];
    taxSummaries: ITaxSummary[];
    currencyConversion: ICurrencyConversion;
    passengerTotalFare: IPassengerTotalFare;
    baggageInformation: IBaggageInformation[];
  };
}

interface IFareComponents {
  ref: number;
  beginAirport: string;
  endAirport: string;
  segments: ISegment[];
}

interface IBaggageInformation {
  provisionType: string;
  airlineCode: string;
  segments: {
    id: number;
  }[];
  allowance: {
    ref: number;
  };
}
interface IPassengerTotalFare {
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

interface ICurrencyConversion {
  from: string;
  to: string;
  exchangeRateUsed: number;
}

interface ITaxes {
  ref: number;
}

interface ITaxSummary {
  ref: number;
}

interface ISegment {
  segment: {
    bookingCode: string;
    cabinCode: string;
    mealCode?: string;
    seatsAvailable: number;
    availabilityBreak?: true;
    fareBreakPoint?: true;
  };
}

interface ITotalFare {
  totalPrice: number;
  totalTaxAmount: number;
  currency: string;
  baseFareAmount: number;
  baseFareCurrency: string;
  constructionAmount: number;
  constructionCurrency: string;
  equivalentAmount: number;
  equivalentCurrency: string;
}

interface IObFeeDesc {
  id: number;
  amount: number;
  currency: string;
}

interface IFareComponentDesc {
  id: 1;
  governingCarrier: string;
  fareAmount: number;
  fareCurrency: string;
  fareBasisCode: string;
  farePassengerType: string;
  publishedFareAmount: number;
  directionality: string;
  applicablePricingCategories: string;
  vendorCode: string;
  fareTypeBitmap: string;
  fareType: string;
  fareTariff: string;
  fareRule: string;
  cabinCode: string;
  segments: {
    segment: {
      stopover?: boolean;
      surcharges?: {
        amount: number;
        currency: string;
        description: string;
        type: string;
      }[];
    };
  }[];
}

interface IBaggageAllowanceDesc {
  id: number;
  pieceCount?: number;
  weight?: number;
  unit?: string;
}

interface ILegDesc {
  id: number;
  elapsedTime: number;
  schedules: {
    ref: number;
    departureDateAdjustment?: number;
  }[];
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

interface ITaxSummeryDesc {
  id: number;
  code: string;
  amount: number;
  currency: string;
  description: string;
  publishedAmount?: number;
  publishedCurrency?: string;
  station?: string;
  country?: string;
}

interface scheduleDescs {
  id: 1;
  frequency: string;
  stopCount: number;
  eTicketable: boolean;
  totalMilesFlown: number;
  message?: string;
  messageType?: string;
  elapsedTime: number;
  departure: IDeparture;
  arrival: IArrival;
  carrier: ICarrier;
}

interface IDeparture {
  airport: string;
  city: string;
  state?: string;
  country: string;
  time: string;
  terminal?: string;
  dateAdjustment?: number;
}
interface IArrival {
  airport: string;
  city: string;
  state?: string;
  country: string;
  time: string;
  terminal?: string;
  dateAdjustment?: number;
}
interface ICarrier {
  marketing: string;
  marketingFlightNumber: number;
  operating: string;
  operatingFlightNumber: number;
  equipment: {
    code: string;
    typeForFirstLeg: string;
    typeForLastLeg: string;
  };
}
