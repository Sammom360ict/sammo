import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { AirlineCommissionValidator } from '../utils/validators/airlineCommission.validator';
import { AirlinesCommissionService } from '../services/airlineCommission.service';

export class AirlineCommissionController extends AbstractController {
  private validator = new AirlineCommissionValidator();
  private services = new AirlinesCommissionService();
  constructor() {
    super();
  }

  // create controller
  public create = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createAirlinesCommissionSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.create(req);
      res.status(code).json(rest);
    }
  );

  // get controller
  public get = this.asyncWrapper.wrap(
    { querySchema: this.validator.getAirlinesCommissionSchema },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.get(req);
      res.status(code).json(rest);
    }
  );

  // update controller
  public update = this.asyncWrapper.wrap(
    {
      bodySchema: this.validator.updateAirlinesCommissionSchema,
      paramSchema: this.commonValidator.singleParamStringValidator('code'),
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.update(req);
      res.status(code).json(rest);
    }
  );

  // delete controller
  public delete = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamStringValidator('code'),
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.delete(req);
      res.status(code).json(rest);
    }
  );
}
