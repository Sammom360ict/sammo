import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import {
  IInsertFlightSegmentPayload,
  IInsertFlightTravelerPayload,
} from "../../../utils/interfaces/flight/flightBookingInterface";
import { IFlightOption } from "../../../utils/interfaces/flight/flightSearchInterface";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import ResponseFormatter from "../../../utils/lib/responseFormatter";
import SabreRequests from "../../../utils/lib/sabreRequest";
import {
  CANCEL_BOOKING_ENDPOINT,
  FLIGHT_BOOKING_ENDPOINT,
} from "../../../utils/miscellaneous/sabreApiEndpoints";
import BookingFlightService from "./bookinglight.service";

class flightBookingService extends AbstractServices {
  private ResFormatter = new ResponseFormatter();
  private RequestFormatter = new RequestFormatter();
  private BookingFlightService = new BookingFlightService();
  private request = new SabreRequests();
  constructor() {
    super();
  }

  public async flightBooking(req: Request) {
    const body = req.body;
    const clientIP = req.ip as string;
    // const flight_id = body.flight_id;
    const { flight_id, passengers: traveler } = req.body;
    const { agency_id, id: user_id } = req.agency;
    const commission_per = 5;
    // const data = await revalidateFlight(clientIP, flight_id);
    const data = await this.BookingFlightService.subRevalidate(
      clientIP,
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
      const requestBody = this.RequestFormatter.pnrReqBody(body, data);

      const response: any = await this.request.postRequest(
        FLIGHT_BOOKING_ENDPOINT,
        requestBody
      );
      console.log({ response });

      if (!response) {
        return {
          success: false,
          code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
          message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
        };
      }
      if (
        response?.CreatePassengerNameRecordRS?.ApplicationResults?.status !==
        "Complete"
      ) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: this.ResMsg.HTTP_BAD_REQUEST,
          data: response.CreatePassengerNameRecordRS.ApplicationResults,
        };
      }

      const formattedResponse = await this.ResFormatter.pnrResponseFormatter(
        response
      );

      const {
        LastTicketingDate,
        pnrId: pnr_code,
        PersonName,
        FlightSegment,
      } = formattedResponse;

      //save traveler
      const travelersModel = this.Model.agencyModel();
      const traveler_promises = body.passengers.map(async (element: any) => {
        if (element.save_information) {
          const {
            mid_name,
            save_information,
            country,
            passport_expire_date,
            ...rest
          } = element;
          return travelersModel.insertTraveler({
            first_name: mid_name,
            ...rest,
            agency_id,
            country_id: country ? Number(country) : undefined,
            passport_expire_date: passport_expire_date
              ? passport_expire_date.split("T")[0]
              : undefined,
          });
        }
      });
      await Promise.all(traveler_promises);

      // create pnr
      const flightBookingModel = this.Model.b2bFlightBookingModel(trx);

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
      const res = await flightBookingModel.insertFlightBooking({
        agency_id,
        pnr_code,
        total_passenger: PersonName.length,
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

      const segmentBody: IInsertFlightSegmentPayload[] = [];

      flights.forEach((flight) => {
        flight.options.forEach((option: IFlightOption) => {
          segmentBody.push({
            flight_booking_id: res[0].id,
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
              "-" +
              option.arrival.city_code +
              ")",
            flight_number: `${option.carrier.carrier_marketing_code} ${option.carrier.carrier_marketing_flight_number}`,
            origin:
              option.departure.airport +
              " (" +
              option.departure.city +
              "-" +
              option.departure.city_code +
              ")",
          });
        });
      });

      await flightBookingModel.insertFlightSegment(segmentBody);

      //insert traveler
      let travelerBody: IInsertFlightTravelerPayload[] = [];
      travelerBody = traveler.map((obj: any) => {
        const { save_information, passport_expire_date, ...rest } = obj;
        return {
          ...rest,
          flight_booking_id: res[0].id,
          passport_expiry_date: passport_expire_date
            ? passport_expire_date.split("T")[0]
            : undefined,
        };
      });

      await flightBookingModel.insertFlightTraveler(travelerBody);
      return {
        success: true,
        message: "Pnr has been created successfully",
        ticketLastDateTime: ticket_issue_last_time
          ? ticket_issue_last_time
          : null,
        booking_id: res[0].id,
        data: formattedResponse,
        response,
        code: this.StatusCode.HTTP_OK,
      };
    });
  }

  public async getAllFlightBooking(req: Request) {
    const { agency_id, id: user_id } = req.agency;

    const { status, limit, skip, from_date, to_date } = req.query;

    const flightBookingModel = this.Model.b2bFlightBookingModel();

    const { data, total } = await flightBookingModel.getAllFlightBooking({
      limit: limit as string,
      skip: skip as string,
      user_id: user_id,
      status: status as string,
      from_date: from_date as string,
      to_date: to_date as string,
    });

    return {
      success: true,
      data,
      total,
      code: this.StatusCode.HTTP_OK,
    };
  }

  // get single flight booking
  public async getSingleFlightBooking(req: Request) {
    const { agency_id, id: user_id } = req.agency;

    const { id } = req.params;

    const model = this.Model.b2bFlightBookingModel();

    const checkBooking = await model.getSingleFlightBooking({
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

    const getSegments = await model.getFlightSegment(Number(id));

    const getTraveler = await model.getFlightTraveler(Number(id));
    getTraveler.forEach((item) => {
      if (item.gender === "M") {
        item.gender = "Male";
      }
      if (item.gender === "F") {
        item.gender = "Female";
      }
    });

    // const sabre_response:any = await postRequest(GET_BOOKING_ENDPOINT, {
    //   confirmationId: checkBooking[0].pnr_code,
    // });

    const ticket_model = this.Model.b2bFlightBookingModel();
    const ticket_issue_data = await ticket_model.getSingleIssueTicket(
      Number(id)
    );
    const ticket_issue_segment_data = await ticket_model.getTicketSegment(
      Number(id)
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: {
        ...checkBooking[0],
        segments: getSegments,
        traveler: getTraveler,
        ticket: ticket_issue_data.length
          ? { ticket_issue_data, ticket_issue_segment_data }
          : null,
      },
    };
  }

  // cancel flight booking
  public async cancelFlightBooking(req: Request) {
    const flightBookingModel = this.Model.b2bFlightBookingModel();
    const { id: booking_id } = req.params;
    let { id: user_id, agency_id } = req.agency;

    console.log("fine");
    const checkFlightBooking = await flightBookingModel.getSingleFlightBooking({
      user_id,
      id: Number(booking_id),
      status: "pending",
    });

    if (!checkFlightBooking.length) {
      return {
        success: false,
        message: this.ResMsg.HTTP_NOT_FOUND,
        code: this.StatusCode.HTTP_NOT_FOUND,
      };
    }

    const { ticket_issue_last_time, pnr_code } = checkFlightBooking[0];

    // Convert the database timestamp string to a Date object in UTC
    const databaseUTCTimestamp = Date.parse(ticket_issue_last_time);

    // Get the current UTC timestamp
    const currentUTCTimestamp = Date.now();

    if (currentUTCTimestamp < databaseUTCTimestamp) {
      const requestBody = this.RequestFormatter.cancelBookingReqBody(pnr_code);
      const response = await this.request.postRequest(
        CANCEL_BOOKING_ENDPOINT,
        requestBody
      );

      if (!response.errors) {
        await flightBookingModel.updateBooking(
          { status: "cancelled", cancelled_by: user_id },
          parseInt(booking_id)
        );
        return {
          success: true,
          message: "Booking successfully canceled",
          code: this.StatusCode.HTTP_OK,
        };
      } else {
        return {
          success: false,
          message: "PNR is not valid for cancel",
          code: this.StatusCode.HTTP_NOT_FOUND,
        };
      }
    } else {
      return {
        success: false,
        message: "The ticket cancellation time has already passed",
        code: this.StatusCode.HTTP_BAD_REQUEST,
      };
    }
  }
}

export default flightBookingService;
