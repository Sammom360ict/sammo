import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { v4 as uuidv4 } from "uuid";
export class AdminPromotionalService extends AbstractServices {
  constructor() {
    super();
  }

  // insert promo code
  public async insertPromoCode(req: Request) {
    const { id } = req.admin;

    const model = this.Model.promotionModel();

    const { data: checkCode } = await model.getPromoCodeList({
      code: req.body.code,
    });

    if (checkCode.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.HTTP_CONFLICT,
      };
    }

    await model.insertPromoCode({ ...req.body, created_by: id });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  //get promo code list
  public async getAllPromoCode(req: Request) {
    const { limit, skip, status, code } = req.query;
    const data = await this.Model.promotionModel().getPromoCodeList({
      limit: Number(limit),
      skip: Number(skip),
      status: status as string,
      code: code as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //update promo code
  public async updatePromoCode(req: Request) {
    const model = this.Model.promotionModel();

    if (req.body?.code) {
      const { data: checkCode } = await model.getPromoCodeList({
        code: req.body.code,
      });

      if (checkCode.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Promo code already exist",
        };
      }
    }

    await model.updatePromoCode({ ...req.body }, parseInt(req.params.id));

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // insert offer
  public async inserOffer(req: Request) {
    const { id } = req.admin;

    const model = this.Model.promotionModel();

    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }

    req.body.slug =
      req.body.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]/g, "") +
      "-" +
      uuidv4();

    // check if this slug already exists
    const { data: check_slug } = await model.getOfferList({
      slug: req.body.slug,
    });

    if (check_slug.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.SLUG_EXISTS,
      };
    }

    if (req.body.promo_code_id) {
      const checkCode = await model.getSinglePromoCode(
        parseInt(req.body.promo_code_id)
      );

      if (!checkCode.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }
    }

    await model.insertOffer({ ...req.body, created_by: id });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  //get all offer
  public async getAlOffer(req: Request) {
    const { limit, skip, status, name } = req.query;
    const data = await this.Model.promotionModel().getOfferList({
      limit: Number(limit),
      skip: Number(skip),
      status: status as string,
      name: name as string,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single offer
  public async getSingleOffer(req: Request) {
    const data = await this.Model.promotionModel().getSingleOffer({
      id: parseInt(req.params.id),
    });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  //update offer
  public async updateOffer(req: Request) {
    const model = this.Model.promotionModel();

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }

    if (req.body.title) {
      req.body.slug =
        req.body.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]/g, "") +
        "-" +
        uuidv4();
    }

    await model.updateOffer({ ...req.body }, parseInt(req.params.id));

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }
}
