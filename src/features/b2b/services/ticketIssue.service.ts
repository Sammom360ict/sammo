import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { BookingPaymentService } from "./subServices/payment.service";
import {
  orderChangeEndPoint,
  orderReshopEndPoint,
} from "../../../utils/miscellaneous/bdFareApiEndpoints";
import SabreRequests from "../../../utils/lib/sabreRequest";
import ResponseFormatter from "../../../utils/lib/responseFormatter";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import {
  GET_BOOKING_ENDPOINT,
  TICKET_ISSUE_ENDPOINT,
} from "../../../utils/miscellaneous/sabreApiEndpoints";

class TicketIssueService extends AbstractServices {
  private subServices = new BookingPaymentService();
  private request = new SabreRequests();
  private ResFormatter = new ResponseFormatter();
  private RequestFormatter = new RequestFormatter();
  constructor() {
    super();
  }

  // // TICKET ISSUE
  // public async ticketIssue(booking_id:number, pnr_code: string) {
  //   return this.db.transaction(async (trx) => {

  //     const booking_model = await this.Model.flightBookingModel(trx);
  //     const ticketIssueModel = await this.Model.flightTicketIssueModel(trx);

  //     //get booking details from sabre
  //     const sabre_response: any = await this.sabreRequest.postRequest(GET_BOOKING_ENDPOINT, {
  //       confirmationId: pnr_code,
  //     });

  //     if (!sabre_response || !sabre_response?.flightTickets) {
  //       return {
  //         success: false,
  //         code: this.StatusCode.HTTP_BAD_REQUEST,
  //         message: this.ResMsg.HTTP_BAD_REQUEST,
  //         redirect_url: `${CLIENT_URL}/paymentSuccess/${booking_id}`
  //       }
  //     }

  //     //ticket issue insertion
  //     for (let i = 0; i < sabre_response.flightTickets.length; i++) {
  //       await ticketIssueModel.createFlightTicketIssue({
  //         flight_booking_id: booking_id,
  //         traveler_given_name: sabre_response.travelers[i].givenName,
  //         traveler_surname: sabre_response.travelers[i].surname,
  //         traveler_reference: sabre_response.travelers[i].nameReferenceCode,
  //         reservation_code: pnr_code,
  //         date_issued: sabre_response.flightTickets[i].date,
  //         ticket_number: sabre_response.flightTickets[i].number,
  //         issuing_airline: sabre_response.flights[0].airlineName,
  //         issuing_agent: sabre_response.creationDetails.creationUserSine,
  //         iata_number: sabre_response.flightTickets[i].agencyIataNumber,
  //         sub_total: sabre_response.payments.flightTotals[0].subtotal,
  //         taxes: sabre_response.payments.flightTotals[0].taxes,
  //         total: sabre_response.payments.flightTotals[0].total,
  //         currency: sabre_response.payments.flightTotals[0].currencyCode,
  //         traveler_type: sabre_response.travelers[i].type
  //       })
  //     }

  //     let bags;
  //     if (sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.maximumPieces) {
  //       bags = sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.maximumPieces + "pcs";
  //     }
  //     else if (sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.totalWeightInPounds) {
  //       bags = sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.totalWeightInPounds + "lb";
  //     }
  //     else if (sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.totalWeightInKilograms) {
  //       bags = sabre_response.fares[0].fareConstruction[0].checkedBaggageAllowance.totalWeightInKilograms + "k";
  //     }

  //     const flight_segment_data = await booking_model.getFlightSegment(booking_id);

  //     //flight segment insertion
  //     for (let i = 0; i < sabre_response.flights.length; i++) {
  //       let departure_data = flight_segment_data[i] ? flight_segment_data[i].origin : null;
  //       if (departure_data) {
  //         const part1 = departure_data.split('(')[1].split(')')[0];
  //         const part2 = part1.split('-').slice(0, 2).join('-').trim();
  //         const [city, country] = part2.split(' - ').map((part: string) => part.trim().toUpperCase());
  //         departure_data = `${city}, ${country}`;
  //       }
  //       let arrival_data = flight_segment_data[i] ? flight_segment_data[i].destination : null;
  //       if (arrival_data) {
  //         const part1 = arrival_data.split('(')[1].split(')')[0];
  //         const part2 = part1.split('-').slice(0, 2).join('-').trim();
  //         const [city, country] = part2.split(' - ').map((part: string) => part.trim().toUpperCase());
  //         arrival_data = `${city}, ${country}`;
  //       }
  //       await ticketIssueModel.createFlightTicketSegment({
  //         flight_booking_id: booking_id,
  //         airline_name: sabre_response.flights[i].airlineName,
  //         airline_code: sabre_response.flights[i].airlineCode,
  //         flight_number: sabre_response.flights[i].flightNumber,
  //         reservation_code: sabre_response.flights[i].confirmationId,
  //         departure_address: departure_data,
  //         departure_time: sabre_response.flights[i].departureTime,
  //         departure_terminal: sabre_response.flights[i].departureTerminalName,
  //         arrival_address: arrival_data,
  //         arrival_time: sabre_response.flights[i].arrivalTime,
  //         arrival_terminal: sabre_response.flights[i].arrivalTerminalName,
  //         departure_date: sabre_response.flights[i].departureDate,
  //         cabin_type: sabre_response.flights[i].cabinTypeName,
  //         cabin_code: sabre_response.flights[i].cabinTypeCode,
  //         status: sabre_response.flights[i].flightStatusName,
  //         fare_basis: sabre_response.fares[0].fareConstruction[0].fareBasisCode,
  //         bags: bags,
  //         operated_by: sabre_response.flights[i].operatingAirlineName,
  //         from_airport_code: sabre_response.flights[i].fromAirportCode,
  //         to_airport_code: sabre_response.flights[i].toAirportCode,
  //         arrival_date: sabre_response.flights[i].arrivalDate
  //       })
  //     }

  //     return {
  //       success: true,
  //       code: this.StatusCode.HTTP_SUCCESSFUL,
  //       message: `Ticket has been issued`,
  //       redirect_url: `${CLIENT_URL}/paymentSuccess/${booking_id}`
  //     }

  //   });
  // }

  //Ticket issue
  public async ticketIssue(req: Request) {
    const flightBookingModel = this.Model.b2bFlightBookingModel();
    const ticketModel = this.Model.b2bTicketIssueModel();
    const { id: booking_id } = req.params;
    let { id: user_id, agency_id } = req.agency;

    const checkFlightBooking = await flightBookingModel.getSingleFlightBooking({
      id: Number(booking_id),
      status: "pending",
      user_id,
    });

    if (!checkFlightBooking.length) {
      return {
        success: false,
        message: this.ResMsg.HTTP_NOT_FOUND,
        code: this.StatusCode.HTTP_NOT_FOUND,
      };
    }

    const { ticket_issue_last_time, payable_amount, pnr_code } =
      checkFlightBooking[0];

    // Convert the database timestamp string to a Date object in UTC
    const databaseUTCTimestamp = Date.parse(ticket_issue_last_time);

    console.log({ checkFlightBooking });

    // Get the current UTC timestamp
    const currentUTCTimestamp = Date.now();
    if (currentUTCTimestamp < databaseUTCTimestamp) {
      //check agency balance
      const agency_model = this.Model.agencyModel();
      const agency_balance = await agency_model.getTotalDeposit(agency_id);

      if (Number(payable_amount) > Number(agency_balance)) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: "There is insufficient balance in your account",
        };
      }

      const ticketReqBody = this.RequestFormatter.ticketIssueReqBody(pnr_code);
      const response = await this.request.postRequest(
        TICKET_ISSUE_ENDPOINT,
        ticketReqBody
      );

      if (response?.AirTicketRS?.ApplicationResults?.status === "Complete") {
        //create deposit
        await agency_model.insertAgencyDeposit({
          agency_id,
          type: "debit",
          amount: payable_amount,
          details: `ticket has been issued for pnr: ${pnr_code}`,
        });
        //update booking
        await flightBookingModel.updateBooking(
          { status: "issued" },
          Number(booking_id)
        );

        //get booking details from sabre
        const sabre_response: any = await this.request.postRequest(
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
        code: this.StatusCode.HTTP_BAD_REQUEST,
        success: false,
        message:
          "Ticket last issue time has been already passed for ticket issue",
      };
    }
  }
}

export default TicketIssueService;
