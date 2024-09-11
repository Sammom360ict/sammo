import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import { AdminAgencyService } from "../services/adminAgency.service";
import { AdminPrmotionValidator } from "../utils/validators/admin.promotion.validator";
import { AdminPromotionalService } from "../services/adminPromotional.service";

export class AdminPromotionalController extends AbstractController {
  private services = new AdminPromotionalService();
  private validator = new AdminPrmotionValidator();
  constructor() {
    super();
  }

  // insert promo code
  public insertPromoCode = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createPromoCodeValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.insertPromoCode(req);

      res.status(code).json(rest);
    }
  );

  // get all promo code
  public getAllPromoCode = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getAllPromoCode(req);

      res.status(code).json(rest);
    }
  );

  // update promo code
  public updatePromoCode = this.asyncWrapper.wrap(
    {
      bodySchema: this.validator.updatePromoCodeValidator,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.updatePromoCode(req);

      res.status(code).json(rest);
    }
  );

  // insert offer
  public inserOffer = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createOfferValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.inserOffer(req);

      res.status(code).json(rest);
    }
  );

  // get all offer
  public getAllOffer = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getAlOffer(req);

      res.status(code).json(rest);
    }
  );

  // get single offer
  public getSingleOffer = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.getSingleOffer(req);

      res.status(code).json(rest);
    }
  );

  // update offer
  public updateOffer = this.asyncWrapper.wrap(
    {
      bodySchema: this.validator.updateOfferValidator,
      paramSchema: this.commonValidator.singleParamValidator,
    },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.updateOffer(req);

      res.status(code).json(rest);
    }
  );
}
