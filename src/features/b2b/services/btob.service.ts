import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";

export class BtobService extends AbstractServices {
  //create visa application
  public async insertDeposit(req: Request) {
    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      req.body["docs"] = files[0].filename;
    }

    await this.Model.agencyModel().insertAgencyDepositRequest({
      ...req.body,
      agency_id: req.agency.agency_id,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  //get list
  public async getAllDepositRequestList(req: Request) {
    const { agency_id } = req.agency;
    const { limit, skip, status } = req.query;
    const data = await this.Model.agencyModel().getAllAgencyDepositRequest({
      agency_id,
      limit: Number(limit),
      skip: Number(skip),
      status: status as string,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single
  public async getSingleApplication(req: Request) {
    const { id: agent_id } = req.agency;
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.b2bSingleApplication(Number(id), agent_id);
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const traveler_data = await model.b2bTravelerList(Number(id));
    const tracking_data = await model.b2bTrackingList(Number(id));
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...data[0], traveler_data, tracking_data },
    };
  }
}
