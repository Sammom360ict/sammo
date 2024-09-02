import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import {
  ICreateAirlinesPayload,
  IUpdateAirlinesPayload,
} from "../../../utils/interfaces/common/commonInterface";

export class AirlinesService extends AbstractServices {
  constructor() {
    super();
  }

  //insert airline
  public async insertAirlines(req: Request) {
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const body = req.body as ICreateAirlinesPayload;
    const model = this.Model.commonModel();
    const insert_airline = await model.insertAirline(body);
    if (insert_airline.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }

  //update airline
  public async updateAirlines(req: Request) {
    const airlines_id = req.params.id;

    const files = (req.files as Express.Multer.File[]) || [];

    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const body = req.body as IUpdateAirlinesPayload;
    const model = this.Model.commonModel();
    await model.updateAirlines(body, Number(airlines_id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  //delete airline
  public async deleteAirlines(req: Request) {
    const airlines_id = req.params.id;
    const model = this.Model.commonModel();
    const del_airline = await model.deleteAirlines(Number(airlines_id));
    if (del_airline > 0) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
  }
}
