import { Request } from 'express';
import AbstractServices from '../../../abstract/abstract.service';

export class AirlinesCommissionService extends AbstractServices {
  constructor() {
    super();
  }

  // create airlines commission service
  public async create(req: Request) {
    const body = req.body;
    const { id } = req.admin;
    const model = this.Model.AirlineCommissionModel();

    const check = await model.get({ check_code: body.airline_code });

    if (check.data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_CONFLICT,
        message: 'Airline code already exist!',
      };
    }

    await model.insert({ ...body, updated_by: id });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // get airlines commission service
  public async get(req: Request) {
    const query = req.query;
    const model = this.Model.AirlineCommissionModel();

    const { data, total } = await model.get(query, true);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }

  // update airlines commission service
  public async update(req: Request) {
    const body = req.body;
    const { id } = req.admin;
    const { code } = req.params;
    const model = this.Model.AirlineCommissionModel();
    if (body.soto_allowed === 0) {
      body.soto_commission = 0.00;
    }

    await model.update({ ...body, updated_by: id, last_updated: new Date() }, code);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  // delete airlines commission service
  public async delete(req: Request) {
    const { code } = req.params;
    const model = this.Model.AirlineCommissionModel();

    await model.delete(code);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
