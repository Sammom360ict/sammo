import AbstractRouter from "../../../abstract/abstract.router";
import { AdminVisaController } from "../controllers/visa.controller";

export class AdminVisaRouter extends AbstractRouter{
    private controller = new AdminVisaController();
    constructor(){
        super();
        this.callRouter();
    }

    private callRouter(){

        //get b2c applications
        this.router.route('/btoc/application')
        .get(this.controller.getB2CApplications)
        //single b2c application, update
        this.router.route('/btoc/application/:id')
        .get(this.controller.getB2CSingleApplication)
        .post(this.controller.createB2CTrackingOfApplication);


        //get b2b applications
        this.router.route('/btob/application')
        .get(this.controller.getB2BApplications)
        //single b2b application, update
        this.router.route('/btob/application/:id')
        .get(this.controller.getB2BSingleApplication)
        .post(this.controller.createB2BTrackingOfApplication);

        
        //create visa, get list
        this.router.route('/')
        .post(this.controller.createVisa)
        .get(this.controller.getVisa);

        //get single visa, update visa
        this.router.route('/:id')
        .get(this.controller.getSingleVisa)
        .patch(this.controller.updateVisa);
    }
}