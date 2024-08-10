import {Request} from 'express';
import AbstractServices from '../../../abstract/abstract.service';

export class B2BDashboardService extends AbstractServices{

    //dashboard
    public async dashboardService(req: Request) {
        const {id} = req.agency;
        const model = this.Model.agencyModel();
        const data = await model.agentDashboard(id);
        return{
            code: this.StatusCode.HTTP_OK,
            data: data
        }
    }
}