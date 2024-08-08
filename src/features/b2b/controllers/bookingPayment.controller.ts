import AbstractController from "../../../abstract/abstract.controller";
import {Request, Response} from 'express';
import { BookingPaymentServices } from "../services/bookingPayment.service";
export class BookingPaymentController extends AbstractController{
    private service = new BookingPaymentServices();
    constructor(){
        super();
    }

    //create payment
    public createPayment = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
            const {code,...data} = await this.service.createPayment(req);
            res.status(code).json(data);
        }
    );

    //get transaction
    public getTransaction = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
            const {code,...data} = await this.service.getTransaction(req);
            res.status(code).json(data);
        }
    )
}