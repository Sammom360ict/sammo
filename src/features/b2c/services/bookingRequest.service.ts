import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { IFlightOption } from "../../../utils/interfaces/flight/flightSearchInterface";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import ResponseFormatter from "../../../utils/lib/responseFormatter";
import SabreRequests from "../../../utils/lib/sabreRequest";
import BookingFlightService from "./bookingFlight.service";

class BookingRequestService extends AbstractServices {
  private ResFormatter = new ResponseFormatter();
  private RequestFormatter = new RequestFormatter();
  private BookingFlightService = new BookingFlightService();
  private request = new SabreRequests();
  constructor() {
    super();
  }
  public async flightBooking(req: Request) {
    const body = req.body;
    // const clientIP = req.ip as string;
    // const flight_id = body.flight_id;
    const { search_id, flight_id, passengers: traveler } = req.body;
    const { id: user_id } = req.user;
    const commission_per = 5;
    // const data = await revalidateFlight(clientIP, flight_id);
    const data = await this.BookingFlightService.subRevalidate(
      search_id,
      flight_id
      // agency_commission
    );
    console.log({ data });
    if (!data) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    return await this.db.transaction(async (trx) => {
      //save traveler
      const travelersModel = this.Model.travelerModel();
      const traveler_promises = body.passengers.map(async (element: any) => {
        if (element.save_information) {
          const {
            mid_name,
            save_information,
            country,
            passport_expire_date,
            reference,
            phone,
            ...rest
          } = element;
          return travelersModel.insertTraveler({
            user_id,
            first_name: mid_name,
            title: reference,
            mobile_number: phone,
            country_id: country ? Number(country) : undefined,
            passport_expiry_date: passport_expire_date
              ? passport_expire_date.split("T")[0]
              : undefined,
            ...rest,
          });
        }
      });
      await Promise.all(traveler_promises);
      // create pnr
      const bookingRequestModel = this.Model.bookingRequestModel(trx);
      const ticket_price = data.fare.total_price;
      const base_fare = data.fare.base_fare;
      const total_tax = data.fare.total_tax;
      const ait = data.fare.ait;
      const discount = data.fare.discount;
      const commission = data.fare.commission;
      const payable_amount = data.fare.payable;
      let ticket_issue_last_time: any = undefined;
      if (data.ticket_last_date && data.ticket_last_time) {
        ticket_issue_last_time =
          String(data.ticket_last_date) + " " + String(data.ticket_last_time);
      }
      const { passengers, flights, leg_descriptions } = data;
      let journey_type = "One way";
      if (leg_descriptions.length == 2) {
        journey_type = "Round Trip";
      }
      if (leg_descriptions.length > 2) {
        journey_type = "Multi City";
      }
      //insert flight booking
      const res = await bookingRequestModel.insert({
        user_id,
        total_passenger: passengers.length,
        created_by: user_id,
        ticket_issue_last_time: ticket_issue_last_time,
        base_fare,
        commission,
        journey_type,
        commission_per,
        payable_amount,
        ticket_price,
        total_tax,
        ait,
        discount,
      });
      //insert segment
      let flight_class = "";
      let baggage = "";
      passengers.forEach((item) => {
        flight_class = `${item.availability[0].segments[0].cabin_type}(${item.availability[0].segments[0].booking_code})`;
        baggage = `${item.availability[0].baggage.count} ${item.availability[0].baggage.unit}`;
      });
      const segmentBody: any[] = [];
      flights.forEach((flight) => {
        flight.options.forEach((option: IFlightOption) => {
          segmentBody.push({
            booking_request_id: res[0].id,
            airline: option.carrier.carrier_marketing_airline,
            airline_logo: option.carrier.carrier_marketing_logo,
            arrival_date: option.arrival.date,
            airline_code: option.carrier.carrier_marketing_code,
            arrival_time: option.arrival.time,
            departure_date: option.departure.date,
            departure_time: option.departure.time,
            baggage,
            class: flight_class,
            destination:
              option.arrival.airport +
              " (" +
              option.arrival.city +
              "," +
              option.arrival.city_code +
              ")",
            flight_number: `${option.carrier.carrier_marketing_code} ${option.carrier.carrier_marketing_flight_number}`,
            origin:
              option.departure.airport +
              " (" +
              option.departure.city +
              "," +
              option.departure.city_code +
              ")",
          });
        });
      });
      await bookingRequestModel.insertSegment(segmentBody);
      //insert traveler
      let travelerBody: any[] = [];
      travelerBody = traveler.map((obj: any) => {
        const { save_information, passport_expire_date, ...rest } = obj;
        return {
          ...rest,
          booking_request_id: res[0].id,
          passport_expiry_date: passport_expire_date
            ? passport_expire_date.split("T")[0]
            : undefined,
        };
      });
      await bookingRequestModel.insertTraveler(travelerBody);
      return {
        success: true,
        message: "Booking Request has been created successfully",
        ticketLastDateTime: ticket_issue_last_time
          ? ticket_issue_last_time
          : null,
        booking_id: res[0].id,
        code: this.StatusCode.HTTP_OK,
      };
    });
  }
  public async getAllFlightBooking(req: Request) {
    const { id: user_id } = req.user;
    const { status, limit, skip, from_date, to_date } = req.query;
    const flightBookingModel = this.Model.bookingRequestModel();
    const { data, total } = await flightBookingModel.get(
      {
        limit: limit as string,
        skip: skip as string,
        user_id: user_id,
        status: status as string,
        from_date: from_date as string,
        to_date: to_date as string,
      },
      true
    );
    return {
      success: true,
      data,
      total,
      code: this.StatusCode.HTTP_OK,
    };
  }
  // get single flight booking
  public async getSingleFlightBooking(req: Request) {
    const { id: user_id } = req.user;
    const { id } = req.params;
    const model = this.Model.bookingRequestModel();
    const checkBooking = await model.getSingle({
      user_id,
      id: Number(id),
    });
    if (!checkBooking.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const getSegments = await model.getSegment(Number(id));
    const getTraveler = await model.getTraveler(Number(id));
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: {
        ...checkBooking[0],
        segments: getSegments,
        traveler: getTraveler,
      },
    };
  }
}
export default BookingRequestService;
