import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { BookingPaymentService } from "./subServices/payment.service";
export class BookingPaymentServices extends AbstractServices {
  private subServices = new BookingPaymentService();
  //create payment
  public async createPayment(req: Request) {
    const { id: user_id, first_name, email, phone_number } = req.user;
    const { booking_id } = req.body;
    if (!booking_id) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNPROCESSABLE_ENTITY,
        message: this.ResMsg.HTTP_UNPROCESSABLE_ENTITY,
      };
    }
    const booking_model = this.Model.btocFlightBookingModel();
    const booking_data = await booking_model.getSingleFlightBooking({
      id: Number(booking_id),
      status: "pending",
    });
    if (!booking_data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    //payment session
    const paymentModel = this.Model.paymentModel();
    const paymentTry = await paymentModel.createPaymentTry({
      user_id,
      pnr_id: booking_data[0].pnr_code,
      booking_id: Number(booking_id),
      status: "INITIATE",
      description: "Payment initiate completed.",
      amount: booking_data[0].payable_amount,
      currency: "BDT",
    });

    return await this.subServices.sslPayment({
      total_amount: booking_data[0].payable_amount,
      currency: "BDT",
      tran_id: `${paymentTry[0].id}-${booking_id}-${user_id}`,
      cus_name: first_name,
      cus_email: email,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: phone_number,
      product_name: "ticket issue",
    });
  }

  //get transaction
  public async getTransaction(req: Request) {
    const { agency_id } = req.agency;
    const model = this.Model.agencyModel();
    const { limit, skip, from_date, to_date, type } = req.query;
    const data = await model.getAgencyTransactions({
      agency_id,
      start_date: from_date as string,
      end_date: to_date as string,
      limit: parseInt(limit as string),
      skip: parseInt(skip as string),
      type: type as string,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }
}
