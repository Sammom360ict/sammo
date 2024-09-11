import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import { CLIENT_URL } from "../../../utils/miscellaneous/constants";
import axios from "axios";
import config from "../../../config/config";
import { TICKET_ISSUE_ENDPOINT } from "../../../utils/miscellaneous/sabreApiEndpoints";
import SabreRequests from "../../../utils/lib/sabreRequest";
import TicketIssueService from "../../b2c/services/ticketIssue.service";
class PaymentService extends AbstractServices {
  private requestFormatter = new RequestFormatter();
  private ticketIssueService = new TicketIssueService();
  private sabreRequest = new SabreRequests();
  constructor() {
    super();
  }

  // payment failed
  public async paymentFailed(req: Request) {
    const body = req.body;
    const tran_id = body.tran_id.split("-");
    if (tran_id.length !== 3) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Unverified Transaction",
        redirect_url: `${CLIENT_URL}/paymentFail/${undefined}`,
      };
    }
    const [paymentTryId, bookingId, user_id] = tran_id;
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Payment Failed",
      redirect_url: `${CLIENT_URL}/paymentFail/${bookingId}`,
    };
  }

  public async paymentSuccess(req: Request) {
    const body = req.body;
    const tran_id = body.tran_id.split("-");
    console.log({ tran_id });
    if (tran_id.length !== 3) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Unverified Transaction",
        redirect_url: `${CLIENT_URL}/paymentFail/${undefined}`,
      };
    }
    const [paymentTryId, bookingId, user_id] = tran_id;
    const paymentModel = this.Model.paymentModel();
    const bookingModel = this.Model.btocFlightBookingModel();
    const paymentTry = await paymentModel.getSinglePaymentTry(
      Number(paymentTryId),
      Number(user_id)
    );

    if (!paymentTry.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Unverified Transaction",
        redirect_url: `${CLIENT_URL}/paymentFail/${bookingId}`,
      };
    }
    const { payable_amount, booking_id, pnr_code } = paymentTry[0];

    //confirm payment
    const ssl_response: any = await axios.post(
      `${config.SSL_URL}/validator/api/validationserverAPI.php?val_id=${body?.val_id}&store_id=${config.SSL_STORE_ID}&store_passwd=${config.SSL_STORE_PASSWORD}&format=json`
    );
    if (ssl_response?.data?.status !== "VALID") {
      await paymentModel.updatePaymentTry(
        {
          status: "FAILED",
          description: `Payment was initiated but transaction was not verified. Session ID: ${body?.val_id}, Amount: ${payable_amount}`,
        },
        paymentTryId
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Unverified transaction",
        redirect_url: `${CLIENT_URL}/paymentFail/${bookingId}`,
      };
    } else {
      await paymentModel.insertInvoice({
        user_id,
        total_amount: ssl_response.data.amount,
        booking_id,
        session_id: body.val_id,
        type: ssl_response.data.card_type,
        bank_tran_id: ssl_response.data.bank_tran_id,
        transaction_date: ssl_response.data.tran_date,
      });

      //---ticket issue---//
      const ticketReqBody = this.requestFormatter.ticketIssueReqBody(pnr_code);
      const response = await this.sabreRequest.postRequest(
        TICKET_ISSUE_ENDPOINT,
        ticketReqBody
      );
      if (response?.AirTicketRS?.ApplicationResults?.status === "Complete") {
        const ticket_res = await this.ticketIssueService.ticketIssueDataInsert(
          booking_id,
          pnr_code
        );
        if (ticket_res.success) {
          await paymentModel.updatePaymentTry(
            {
              status: "COMPLETED",
              description: `Payment and ticket issued is completed. PNR:${pnr_code}`,
            },
            paymentTryId
          );
          await bookingModel.updateBooking({ status: "issued" }, booking_id);
          return ticket_res;
        } else {
          await paymentModel.updatePaymentTry(
            {
              status: "PURCHASE_PENDING",
              description: `Payment is completed. But Ticket not confirmed. PNR:${pnr_code}`,
            },
            paymentTryId
          );
          await bookingModel.updateBooking({ status: "paid" }, booking_id);
          return ticket_res;
        }
      } else {
        await paymentModel.updatePaymentTry(
          {
            status: "PURCHASE_PENDING",
            description: `Payment is completed. But Ticket not issued. PNR:${pnr_code}`,
          },
          paymentTryId
        );
        await bookingModel.updateBooking({ status: "paid" }, booking_id);
        return {
          success: true,
          message: "Ticket not issued. Please contact us.",
          code: this.StatusCode.HTTP_OK,
          redirect_url: `${CLIENT_URL}/paymentSuccess/${bookingId}`,
        };
      }
      //---ticket issue---//
    }
  }

  //payment cancelled
  public async paymentCancelled(req: Request) {
    const body = req.body;
    const tran_id = body.tran_id.split("-");
    if (tran_id.length !== 3) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: "Unverified Transaction",
        redirect_url: `${CLIENT_URL}/paymentCancel/${undefined}`,
      };
    }
    const [paymentTryId, bookingId, user_id] = tran_id;
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Payment cancelled",
      redirect_url: `${CLIENT_URL}/paymentCancel/${bookingId}`,
    };
  }
}
export default PaymentService;
