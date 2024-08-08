import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { BtoBSubAgencyService } from '../services/subAgency.service';
import { BtoBSubAgencyValidator } from '../utils/validators/subAgency.validator';

export class BtoBSubAgencyController extends AbstractController {
  private services = new BtoBSubAgencyService();
  private validator = new BtoBSubAgencyValidator();
  constructor() {
    super();
  }

  // create controller
  public create = this.asyncWrapper.wrap(
    {bodySchema: this.validator.createSchema},
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.create(req);

      if (rest.success) {
        res.status(code).json(rest);
      } else {
        this.error(rest.message, code);
      }
    }
  );

  // get controller
  public get = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.get(req);
      res.status(code).json(rest);
    }
  );

  // get single controller
  public getSingle = this.asyncWrapper.wrap(
    {paramSchema: this.commonValidator.singleParamValidator},
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getSingle(req);
      res.status(code).json(rest);
    }
  );
}
