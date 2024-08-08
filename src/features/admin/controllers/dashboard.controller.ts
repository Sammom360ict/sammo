import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import AdminDashboardService from '../services/dashboard.service';

class AdminDashboardController extends AbstractController {
  private service = new AdminDashboardService();

  constructor() {
    super();
  }

  //dashboard
  public get = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.get(req);
      res.status(code).json(data);
    }
  );

}

export default AdminDashboardController;
