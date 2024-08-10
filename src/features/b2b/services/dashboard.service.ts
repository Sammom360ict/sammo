import {Request} from 'express';
import AbstractServices from '../../../abstract/abstract.service';

export class B2BDashboardService extends AbstractServices{

    //dashboard
    public async dashboardService(req: Request) {
        const {id} = req.agency;
        const model = this.Model.agencyModel();
        const data = await model.agentDashboard(id);
        const b2b_flight_model = this.Model.b2bFlightBookingModel();
        const booking_data = await b2b_flight_model.getAllFlightBooking({ limit: "5", skip: "0",user_id:id });
        return{
            code: this.StatusCode.HTTP_OK,
            data: {...data,booking_data:booking_data.data}
        }
    }
}