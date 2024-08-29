import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import CustomError from "../../../utils/lib/customError";

export default class BookingTravelerService extends AbstractServices {
  constructor() {
    super();
  }

  // create traveler service
  public async create(req: Request) {
    const body = req.body;
    const { id } = req.user;
    // const files = (req.files as Express.Multer.File[]) || [];

    // files.forEach((file) => {
    //   if (file.fieldname === 'passport_file') {
    //     body[file.fieldname] = file.filename;
    //   } else {
    //     throw new CustomError('Invalid file field', 422);
    //   }
    // });

    const model = this.Model.travelerModel();
    const traveler_body = {
      user_id: id,
      type: body.type,
      title: body.reference,
      first_name: body.mid_name,
      sur_name: body.sur_name,
      date_of_birth: body.date_of_birth,
      passport_number: body.passport_number,
      passport_expiry_date: body.passport_expire_date,
      city: body.city,
      email: body.email,
      mobile_number: body.phone,
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
    const { id } = req.user;

    const model = this.Model.travelerModel();

    const { data, total } = await model.getTraveler(
      { ...query, deleted: false, user_id: id },
      true
    );

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
    const { id: user_id } = req.user;

    const model = this.Model.travelerModel();

    const data = await model.getSingleTraveler({
      id: Number(id),
      deleted: false,
      user_id,
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
      data,
    };
  }

  // update traveler service
  public async update(req: Request) {
    const body = req.body;
    const { id } = req.params;
    const { id: user_id } = req.user;

    // const files = (req.files as Express.Multer.File[]) || [];

    // files.forEach((file) => {
    //   if (file.fieldname === 'passport_file') {
    //     body[file.fieldname] = file.filename;
    //   } else {
    //     throw new CustomError('Invalid file field', 422);
    //   }
    // });

    const model = this.Model.travelerModel();

    const check = await model.getSingleTraveler({
      id: Number(id),
      deleted: false,
      user_id,
    });

    if (!check.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const traveler_body = {
      type: body.type,
      title: body.reference,
      first_name: body.mid_name,
      sur_name: body.sur_name,
      date_of_birth: body.date_of_birth,
      passport_number: body.passport_number,
      passport_expiry_date: body.passport_expire_date,
      city: body.city,
      email: body.email,
      mobile_number: body.phone,
      frequent_flyer_airline: body.frequent_flyer_airline,
      frequent_flyer_number: body.frequent_flyer_number,
      gender: body.gender,
      country_id: body.country,
      status: body.status,
    };

    await model.updateTraveler(traveler_body, Number(id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }

  //delete traveler service
  public async delete(req: Request) {
    const { id } = req.params;
    const { id: user_id } = req.user;
    const model = this.Model.travelerModel();

    const check = await model.getSingleTraveler({
      id: Number(id),
      deleted: false,
      user_id,
    });

    if (!check.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    await model.deleteTraveler(Number(id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
