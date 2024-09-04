import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import BtobTravelerService from "../services/btobTraveler.service";
import BtobTravelerValidator from "../utils/validators/btobTraveler.validator";

export default class BtobTravelerController extends AbstractController {
  private service = new BtobTravelerService();
  private validator = new BtobTravelerValidator();
  constructor() {
    super();
  }

  // create traveler controller
  public create = this.asyncWrapper.wrap(
    { bodySchema: this.validator.create },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.create(req);

      if (rest.success) {
        res.status(code).json(rest);
      } else {
        this.error(rest.message, code);
      }
    }
  );

  // get traveler controller
  public get = this.asyncWrapper.wrap(
    { querySchema: this.validator.get },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.get(req);

      res.status(code).json(rest);
    }
  );

  // get single traveler controller
  public getSingle = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.getSingle(req);
      res.status(code).json(rest);
    }
  );

  // update traveler controller
  public update = this.asyncWrapper.wrap(
    {
      bodySchema: this.validator.update,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.update(req);

      if (rest.success) {
        res.status(code).json(rest);
      } else {
        this.error(rest.message, code);
      }
    }
  );

  // update traveler controller
  public delete = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.delete(req);

      if (rest.success) {
        res.status(code).json(rest);
      } else {
        this.error(rest.message, code);
      }
    }
  );
}
