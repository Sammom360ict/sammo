import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { AirlinesService } from '../services/airline.service';

export class AirlineController extends AbstractController {
  private services = new AirlinesService();
  constructor() {
    super();
  }

 //insert airlines
 public insertAirlines = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.insertAirlines },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.insertAirlines(req);
      res.status(code).json(data);
    }
  );


  //update airlines
  public updateAirlines = this.asyncWrapper.wrap(
    {
      bodySchema: this.commonValidator.updateAirlines,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.updateAirlines(req);
      res.status(code).json(data);
    }
  );

  //delete airlines
  public deleteAirlines = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.deleteAirlines(req);
      res.status(code).json(data);
    }
  );
}
