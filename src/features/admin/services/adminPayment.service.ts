import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import {
  ICreateAirportPayload,
  IUpdateAirportPayload,
} from "../../../utils/interfaces/common/commonInterface";
import { IAirportFilterQuery } from "../../common/commonUtils/types/commonTypes";

export class PaymentService extends AbstractServices {
  constructor() {
    super();
  }

  //insert airport
  public async insertAgencyCredit(req: Request) {
    const body = req.body as ICreateAirportPayload;
    const model = this.Model.commonModel();
    const checkAirport = await model.getAllAirport(
      { code: body.iata_code },
      false
    );
    console.log({ body });
    if (checkAirport.data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Airport code already exist.",
      };
    }

    await model.insertAirport(body);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  //get all airport
  public async getAllAirport(req: Request) {
    const { country_id, name, limit, skip } = req.query as IAirportFilterQuery;
    const model = this.Model.commonModel();
    const get_airport = await model.getAllAirport(
      { country_id, name, limit, skip },
      true
    );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: parseInt(get_airport.total),
      data: get_airport.data,
    };
  }

  //update airport
  public async updateAirport(req: Request) {
    const airport_id = req.params.id;
    const body = req.body as IUpdateAirportPayload;
    const model = this.Model.commonModel();
    const update_airport = await model.updateAirport(body, Number(airport_id));

    if (update_airport > 0) {
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

  //delete airport
  public async deleteAirport(req: Request) {
    const airport_id = req.params.id;
    const model = this.Model.commonModel();
    const del_airport = await model.deleteAirport(Number(airport_id));

    if (del_airport > 0) {
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
