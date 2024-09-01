import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";

export class AdminVisaService extends AbstractServices {
  //create visa
  public async createVisa(req: Request) {
    const { id } = req.admin;
    const model = this.Model.VisaModel();
    const body = req.body;
    body.created_by = id;
    const create = await model.create(body);
    if (create.length) {
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

  //get visa
  public async getVisa(req: Request) {
    const model = this.Model.VisaModel();
    const data = await model.get(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single visa
  public async getSingleVisa(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.single(Number(id));
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  //update visa
  public async updateVisa(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const res = await model.update(req.body, Number(id));
    if (res) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: req.body,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
  }

  //////-------b2c-----------//

  //get b2c applications
  public async getB2CApplications(req: Request) {
    const model = this.Model.VisaModel();
    const data = await model.getB2CApplication(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get b2c single application
  public async getB2CSingleApplication(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.b2cSingleApplication(Number(id));
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const traveler_data = await model.b2cTravelerList(Number(id));
    const tracking_data = await model.b2cTrackingList(Number(id));
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: { ...data[0], traveler_data, tracking_data },
    };
  }

  //create b2c tracking of application
  public async createB2CTrackingOfApplication(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.b2cSingleApplication(Number(id));
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    req.body.application_id = id;
    const create_tracking = await model.b2cCreateTracking(req.body);
    if (create_tracking.length) {
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

  //--------b2b-----------//
  //get b2b applications
  public async getB2BApplications(req: Request) {
    const model = this.Model.VisaModel();
    const data = await model.getB2BApplication(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get b2b single application
  public async getB2BSingleApplication(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.b2bSingleApplication(Number(id));
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

  //create b2b tracking of application
  public async createB2BTrackingOfApplication(req: Request) {
    const id = req.params.id;
    const model = this.Model.VisaModel();
    const data = await model.b2bSingleApplication(Number(id));
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    req.body.application_id = id;
    const create_tracking = await model.b2bCreateTracking(req.body);
    if (create_tracking.length) {
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
}
