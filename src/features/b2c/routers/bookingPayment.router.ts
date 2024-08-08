import AbstractRouter from "../../../abstract/abstract.router";
import { BookingPaymentController } from "../controllers/bookingPayment.controller";

export class BookingPaymentRouter extends AbstractRouter{
    private controller = new BookingPaymentController();
    constructor(){
        super();
        this.callRouter();
    }

    private callRouter(){

        //payment
        this.router.route('/').post(this.controller.createPayment);

        //transaction list
        this.router.route('/transaction').get(this.controller.getTransaction)
    }
}