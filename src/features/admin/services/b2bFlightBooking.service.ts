import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import {
  orderCancelEndPoint,
  orderChangeEndPoint,
  orderReshopEndPoint,
} from "../../../utils/miscellaneous/bdFareApiEndpoints";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import SabreRequests from "../../../utils/lib/sabreRequest";
import TicketIssueService from "../../b2b/services/ticketIssue.service";
import {
  CANCEL_BOOKING_ENDPOINT,
  GET_BOOKING_ENDPOINT,
  TICKET_ISSUE_ENDPOINT,
} from "../../../utils/miscellaneous/sabreApiEndpoints";

class adminB2BFlightBookingService extends AbstractServices {
  private requestFormatter = new RequestFormatter();
  private sabreRequest = new SabreRequests();
  private RequestFormatter = new RequestFormatter();
  private SabreRequest = new SabreRequests();
  constructor() {
    super();
  }

  // get all flight booking
  public async getAllFlightBooking(req: Request) {
    const { status, limit, skip, from_date, to_date, name } = req.query;

    const flightBookingModel = this.Model.b2bFlightBookingModel();

    const { data, total } = await flightBookingModel.getAllFlightBooking({
      limit: limit as string,
      skip: skip as string,
      status: status as string,
      from_date: from_date as string,
      to_date: to_date as string,
      name: name as string,
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
    const { id } = req.params;

    const model = this.Model.b2bFlightBookingModel();

    const checkBooking = await model.getSingleFlightBooking({
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
    // getSegments.forEach((item) => {
    //   if (item.departure_date && item.departure_time) {
    //     item.departure_date = item.departure_date.split(" ")[0] + "T" + item.departure_time;
    //   }
    //   if (item.arrival_date && item.arrival_time) {
    //     item.arrival_date = item.arrival_date.split(" ")[0] + "T" + item.arrival_time;
    //   }
    // });

    const getTraveler = await model.getFlightBookingTraveler(Number(id));
    // getTraveler.forEach((item) => {
    //   if (item.gender === 'M') {
    //     item.gender = 'Male';
    //   }
    //   if (item.gender === 'F') {
    //     item.gender = 'Female';
    //   }
    // })

    // const sabre_response:any = await postRequest(GET_BOOKING_ENDPOINT, {
    //   confirmationId: checkBooking[0].pnr_code,
    // });

    const ticket_model = this.Model.flightTicketIssueModel();
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
    let { id } = req.admin;

    const checkFlightBooking = await flightBookingModel.getSingleFlightBooking({
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
      const response: any = await this.SabreRequest.postRequest(
        CANCEL_BOOKING_ENDPOINT,
        requestBody
      );

      if (!response || response?.errors) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "Booking cannot be cancelled. Something went wrong",
        };
      }
      await flightBookingModel.updateBooking(
        { status: "cancelled" },
        Number(id)
      );
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Booking has been cancelled",
      };
    } else {
      return {
        success: false,
        message: this.ResMsg.HTTP_BAD_REQUEST,
        code: this.StatusCode.HTTP_BAD_REQUEST,
      };
    }
  }

  //ticket issue
  public async ticketIssue(req: Request) {
    const flightBookingModel = this.Model.b2bFlightBookingModel();
    const ticketModel = this.Model.b2bTicketIssueModel();
    const { id: booking_id } = req.params;
    let { id } = req.admin;

    const checkFlightBooking = await flightBookingModel.getSingleFlightBooking({
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
      const ticketReqBody = this.requestFormatter.ticketIssueReqBody(pnr_code);
      const response = await this.sabreRequest.postRequest(
        TICKET_ISSUE_ENDPOINT,
        ticketReqBody
      );
      if (response?.AirTicketRS?.ApplicationResults?.status === "Complete") {
        //update booking
        await flightBookingModel.updateBooking(
          { status: "issued" },
          Number(booking_id)
        );

        //get booking details from sabre
        const sabre_response: any = await this.SabreRequest.postRequest(
          GET_BOOKING_ENDPOINT,
          {
            confirmationId: pnr_code,
          }
        );

        if (!sabre_response || !sabre_response?.flightTickets) {
          return {
            success: false,
            code: this.StatusCode.HTTP_BAD_REQUEST,
            message: this.ResMsg.HTTP_BAD_REQUEST,
          };
        }

        //ticket issue insertion
        for (let i = 0; i < sabre_response.flightTickets.length; i++) {
          await ticketModel.createFlightTicketIssue({
            flight_booking_id: Number(booking_id),
            traveler_given_name: sabre_response.travelers[i].givenName,
            traveler_surname: sabre_response.travelers[i].surname,
            traveler_reference: sabre_response.travelers[i].nameReferenceCode,
            reservation_code: pnr_code,
            date_issued: sabre_response.flightTickets[i].date,
            ticket_number: sabre_response.flightTickets[i].number,
            issuing_airline: sabre_response.flights[0].airlineName,
            issuing_agent: sabre_response.creationDetails.creationUserSine,
            iata_number: sabre_response.flightTickets[i].agencyIataNumber,
            sub_total: sabre_response.payments.flightTotals[0].subtotal,
            taxes: sabre_response.payments.flightTotals[0].taxes,
            total: sabre_response.payments.flightTotals[0].total,
            currency: sabre_response.payments.flightTotals[0].currencyCode,
          });
        }

        let bags;
        if (
          sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
            .maximumPieces
        ) {
          bags =
            sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
              .maximumPieces + "pcs";
        } else if (
          sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
            .totalWeightInPounds
        ) {
          bags =
            sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
              .totalWeightInPounds + "lb";
        } else if (
          sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
            .totalWeightInKilograms
        ) {
          bags =
            sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance
              .totalWeightInKilograms + "k";
        }

        const flight_segment_data = await flightBookingModel.getFlightSegment(
          Number(booking_id)
        );

        //flight segment insertion
        for (let i = 0; i < sabre_response.flights.length; i++) {
          let departure_data = flight_segment_data[i]
            ? flight_segment_data[i].origin
            : null;
          if (departure_data) {
            const part1 = departure_data.split("(")[1].split(")")[0];
            const part2 = part1.split("-").slice(0, 2).join("-").trim();
            const [city, country] = part2
              .split(" - ")
              .map((part: string) => part.trim().toUpperCase());
            departure_data = `${city}, ${country}`;
          }
          let arrival_data = flight_segment_data[i]
            ? flight_segment_data[i].destination
            : null;
          if (arrival_data) {
            const part1 = arrival_data.split("(")[1].split(")")[0];
            const part2 = part1.split("-").slice(0, 2).join("-").trim();
            const [city, country] = part2
              .split(" - ")
              .map((part: string) => part.trim().toUpperCase());
            arrival_data = `${city}, ${country}`;
          }
          await ticketModel.createFlightTicketSegment({
            flight_booking_id: Number(booking_id),
            airline_name: sabre_response.flights[i].airlineName,
            airline_code: sabre_response.flights[i].airlineCode,
            flight_number: sabre_response.flights[i].flightNumber,
            reservation_code: sabre_response.flights[i].confirmationId,
            departure_address: departure_data,
            departure_time: sabre_response.flights[i].departureTime,
            departure_terminal: sabre_response.flights[i].departureTerminalName,
            arrival_address: arrival_data,
            arrival_time: sabre_response.flights[i].arrivalTime,
            arrival_terminal: sabre_response.flights[i].arrivalTerminalName,
            departure_date: sabre_response.flights[i].departureDate,
            cabin_type: sabre_response.flights[i].cabinTypeName,
            cabin_code: sabre_response.flights[i].cabinTypeCode,
            status: sabre_response.flights[i].flightStatusName,
            fare_basis:
              sabre_response.fares[0].fareConstruction[0].fareBasisCode,
            bags: bags,
            operated_by: sabre_response.flights[i].operatingAirlineName,
          });
        }

        return {
          success: true,
          code: this.StatusCode.HTTP_SUCCESSFUL,
          message: `Ticket has been issued`,
          data: response,
        };
      } else {
        return {
          success: false,
          code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
          message: `Ticket cannot be issued now. Please try again letter`,
          data: response,
        };
      }
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: "Ticket issue time has been expired",
      };
    }
  }

  //manual ticket issue
  public async manualIssueTicket(req: Request) {
    return await this.db.transaction(async (trx) => {
      const flightBookingModel = this.Model.b2bFlightBookingModel(trx);
      const ticketModel = this.Model.b2bTicketIssueModel(trx);
      const { id: booking_id } = req.params;

      const { pax_ticket } = req.body;

      console.log({ pax_ticket });

      const checkFlightBooking =
        await flightBookingModel.getSingleFlightBooking({
          id: Number(booking_id),
          status: "pending",
        });

      console.log({ checkFlightBooking });

      if (!checkFlightBooking.length) {
        return {
          success: false,
          message: this.ResMsg.HTTP_NOT_FOUND,
          code: this.StatusCode.HTTP_NOT_FOUND,
        };
      }

      const { ticket_issue_last_time, pnr_code } = checkFlightBooking[0];

      const travelerIds = pax_ticket.map((item: any) => item.traveler_id);
      // get flight booking traveler
      const bookingTraveler = await flightBookingModel.getFlightBookingTraveler(
        parseInt(booking_id),
        travelerIds
      );

      console.log({ bookingTraveler });
      if (bookingTraveler.length !== travelerIds.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: "Invalid Traveler",
        };
      }

      // update booking traveler with ticket
      Promise.all(
        pax_ticket.map(async (item: any) => {
          return await flightBookingModel.updateFlightBookingTraveler(
            { ticket_number: item.ticket_number },
            item.traveler_id
          );
        })
      );

      //update booking
      await flightBookingModel.updateBooking(
        { status: "issued" },
        Number(booking_id)
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: `Ticket has been issued`,
      };
    });
  }
}

export default adminB2BFlightBookingService;
