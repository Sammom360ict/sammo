import AbstractServices from '../../../abstract/abstract.service';
import { Request } from 'express';

class AdminDashboardService extends AbstractServices {
 
    //dashboard
    public async get(req: Request) {
        const admin_model = this.Model.adminModel();
        const booking_total_data = await admin_model.adminDashboard();
        // const booking_model = this.Model.bookingRequestModel();
        // const booking_data = await booking_model.get({limit:"5", status:'Pending'})
        const flight_model = this.Model.flightBookingModel();
        const booking_data = await flight_model.getAllFlightBooking({limit:"5",skip:"0"});
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: this.ResMsg.HTTP_OK,
            data:{booking_total:booking_total_data.total_booking, booking_data: booking_data.data, booking_graph: booking_total_data.booking_graph}
        }
    }
}

export default AdminDashboardService;
