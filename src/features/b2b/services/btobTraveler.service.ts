import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";

export default class BtobTravelerService extends AbstractServices {
  constructor() {
    super();
  }

  // create traveler service
  public async create(req: Request) {
    const body = req.body;
    const { agency_id } = req.agency;

    const model = this.Model.agencyModel();
    const traveler_body = {
      agency_id,
      type: body.type,
      reference: body.reference,
      first_name: body.mid_name,
      sur_name: body.sur_name,
      date_of_birth: body.date_of_birth,
      passport_number: body.passport_number,
      passport_expire_date: body.passport_expire_date,
      city: body.city,
      email: body.email,
      phone: body.phone,
      frequent_flyer_airline: body.frequent_flyer_airline,
      frequent_flyer_number: body.frequent_flyer_number,
      gender: body.gender,
      country_id: body.country,
    };

    await model.insertTraveler(traveler_body);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // get traveler service
  public async get(req: Request) {
    const query = req.query;
    const { agency_id } = req.agency;

    const model = this.Model.agencyModel();

    const { data, total } = await model.getAllTravelers({
      ...query,
      deleted: false,
      agency_id,
    });

    return {
      success: true,
      data,
      total,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  // get single traveler service
  public async getSingle(req: Request) {
    const { id } = req.params;
    const { agency_id } = req.agency;

    const model = this.Model.agencyModel();

    const data = await model.getSingleTravelers(agency_id, Number(id));

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    return {
      success: true,
      data: data[0],
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  // update traveler service
  public async update(req: Request) {
    const body = req.body;
    const { id } = req.params;
    const { agency_id } = req.agency;

    // const files = (req.files as Express.Multer.File[]) || [];

    // files.forEach((file) => {
    //   if (file.fieldname === 'passport_file') {
    //     body[file.fieldname] = file.filename;
    //   } else {
    //     throw new CustomError('Invalid file field', 422);
    //   }
    // });

    const model = this.Model.agencyModel();

    const check = await model.getSingleTravelers(agency_id, Number(id));

    if (!check.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const traveler_body = {
      type: body.type,
      reference: body.reference,
      first_name: body.mid_name,
      sur_name: body.sur_name,
      date_of_birth: body.date_of_birth,
      passport_number: body.passport_number,
      passport_expire_date: body.passport_expire_date,
      city: body.city,
      email: body.email,
      phone: body.phone,
      frequent_flyer_airline: body.frequent_flyer_airline,
      frequent_flyer_number: body.frequent_flyer_number,
      gender: body.gender,
      status: body.status,
      country_id: body.country,
    };

    await model.updateTravelers(agency_id, Number(id), traveler_body);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  //delete traveler service
  public async delete(req: Request) {
    const { id } = req.params;
    const { id: user_id, agency_id } = req.agency;
    const model = this.Model.agencyModel();

    const check = await model.getSingleTravelers(agency_id, Number(id));

    if (!check.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    await model.deleteTraveler(agency_id, Number(id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
