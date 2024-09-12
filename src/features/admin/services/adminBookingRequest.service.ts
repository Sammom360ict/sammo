import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
export class AdminBookingRequestService extends AbstractServices {
  constructor() {
    super();
  }
  // get booking request
  public async get(req: Request) {
    const query = req.query;
    const bookingReqModel = this.Model.btocBookingRequestModel();
    const { data, total } = await bookingReqModel.get({ ...query });
    return {
      success: true,
      data,
      total,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
  // get single booking request
  public async getSingle(req: Request) {
    const { id } = req.params;
    const bookingReqModel = this.Model.btocBookingRequestModel();
    const data = await bookingReqModel.getSingle({ id: Number(id) });
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const segments = await bookingReqModel.getSegment(Number(id));
    const travelers = await bookingReqModel.getTraveler(Number(id));
    return {
      success: true,
      data: { ...data[0], segments, travelers },
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
  // update booking request
  public async update(req: Request) {
    const { id } = req.params;
    const { id: admin_id } = req.admin;
    const { status, note } = req.body;
    const bookingReqModel = this.Model.btocBookingRequestModel();
    const data = await bookingReqModel.getSingle({ id: Number(id) });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    if (data[0].status !== "pending") {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.STATUS_CANNOT_CHANGE,
      };
    }
    await bookingReqModel.update(
      { status, note, updated_by: admin_id },
      Number(id)
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
