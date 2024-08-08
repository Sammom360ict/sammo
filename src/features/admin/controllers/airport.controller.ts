import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { AirportService } from '../services/airport.service';

export class AirportController extends AbstractController {
  private services = new AirportService();
  constructor() {
    super();
  }

 //insert airport
 public insertAirport = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.createAirportSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.insertAirport(req);
      res.status(code).json(data);
    }
  );

  //update airport
  public updateAirport = this.asyncWrapper.wrap(
    {
      bodySchema: this.commonValidator.updateAirportSchema,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.updateAirport(req);
      res.status(code).json(data);
    }
  );

  //delete airport
  public deleteAirport = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.services.deleteAirport(req);
      res.status(code).json(data);
    }
  );
}
