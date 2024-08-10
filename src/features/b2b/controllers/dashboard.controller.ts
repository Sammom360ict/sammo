import {Request, Response} from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { B2BDashboardService } from '../services/dashboard.service';

export class B2BDashboardController extends AbstractController{

    private service = new B2BDashboardService();

    public dashboardController = this.asyncWrapper.wrap(
        null,
        async (req: Request, res: Response) => {
            const {code,...rest} = await this.service.dashboardService(req);
            res.status(code).json(rest);
        }
    )
}