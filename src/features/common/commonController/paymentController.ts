import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import PaymentService from "../commonService/paymentService";

class PaymentController extends AbstractController {
  private PaymentService = new PaymentService();

  constructor() {
    super();
  }
  //payment failed
  public paymentFailed = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.PaymentService.paymentFailed(req);
      if (rest.redirect_url) {
        console.log(rest.redirect_url);
        res.status(code).redirect(rest.redirect_url);
      } else {
        console.log({ rest });
        res.status(code).json(rest);
      }
    }
  );

  //payment success
  public paymentSuccess = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.PaymentService.paymentSuccess(req);
      if (rest.redirect_url) {
        res.status(code).redirect(rest.redirect_url);
      } else {
        res.status(code).json(rest);
      }
    }
  );

  //payment cancelled
  public paymentCancelled = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.PaymentService.paymentCancelled(req);
      if (rest.redirect_url) {
        res.status(code).redirect(rest.redirect_url);
      } else {
        res.status(code).json(rest);
      }
    }
  );
}

export default PaymentController;
