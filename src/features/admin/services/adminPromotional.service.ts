import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import Lib from "../../../utils/lib/lib";

export class AdminPromotionalService extends AbstractServices {
  constructor() {
    super();
  }

  //deposit to agency
  public async depositToAgency(req: Request) {
    const { id } = req.admin;
    const body = req.body;
    body.created_by = id;
    body.type = "credit";
    const model = this.Model.agencyModel();
    const res = await model.insertAgencyDeposit(body);
    if (res) {
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

  //get list
  public async getAllDepositRequestList(req: Request) {
    const { limit, skip, status } = req.query;
    const data = await this.Model.agencyModel().getAllAgencyDepositRequest({
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

  //get list
  public async updateDepositRequest(req: Request) {
    const { id } = req.params;
    const { status: bdy_status } = req.body;
    const model = this.Model.agencyModel();

    // get single deposit
    const data = await model.getSingleDeposit({
      id: parseInt(req.params.id),
    });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const { status, amount, agency_id } = data[0];
    console.log({ data });

    if (status == "pending" && bdy_status == "approved") {
      console.log("first");
      await model.insertAgencyDeposit({
        type: "credit",
        amount,
        agency_id,
        created_by: req.admin.id,
      });

      await model.updateAgencyDepositRequest(
        {
          status: bdy_status,
        },
        { id: parseInt(id), agency_id }
      );
    } else {
      await model.updateAgencyDepositRequest(
        {
          status: bdy_status,
        },
        { id: parseInt(id), agency_id }
      );
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Updated Succesfully",
    };
  }

  //get transaction
  public async getTransaction(req: Request) {
    const { id } = req.params;
    const model = this.Model.agencyModel();
    const { start_date, end_date, limit, skip } = req.query;
    const data = await model.getAgencyTransactions({
      agency_id: Number(id),
      start_date: start_date as string,
      end_date: end_date as string,
      limit: limit as unknown as number,
      skip: skip as unknown as number,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  // Create agency
  public async create(req: Request) {
    return this.db.transaction(async (trx) => {
      const { id: admin_id } = req.admin;
      const {
        agency_name,
        agency_email,
        agency_phone,
        user_name,
        user_email,
        user_password,
        user_phone,
      } = req.body;

      const files = (req.files as Express.Multer.File[]) || [];
      const agencyModel = this.Model.agencyModel(trx);

      const agencyBody: any = {
        agency_name,
        email: agency_email,
        phone: agency_phone,
        created_by: admin_id,
      };

      const checkEmail = await agencyModel.getSingleUser({ email: user_email });

      if (checkEmail.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_CONFLICT,
          message: "Email already exist.",
        };
      }

      const hashed_password = await Lib.hashPass(user_password);

      const userBody: any = {
        name: user_name,
        email: user_email,
        hashed_password,
        mobile_number: user_phone,
      };

      files.forEach((item) => {
        if (item.fieldname === "agency_logo") {
          agencyBody["agency_logo"] = item.filename;
        } else if (item.fieldname === "user_photo") {
          userBody["photo"] = item.filename;
        }
      });

      const agency = await agencyModel.createAgency(agencyBody);

      userBody["agency_id"] = agency[0].id;

      // let btocToken = '';

      // if (btoc_commission) {
      //   btocToken = uuidv4();
      //   await agencyModel.insertAgencyBtoCToken({
      //     agency_id: agency[0],
      //     token: btocToken,
      //   });
      // }

      await agencyModel.createAgencyUser(userBody);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
        data: {
          id: agency[0].id,
          agency_logo: agencyBody.agency_logo,
          user_photo: userBody.photo,
        },
      };
    });
  }

  // get agency
  public async get(req: Request) {
    const query = req.query;
    const agencyModel = this.Model.agencyModel();
    const { data, total } = await agencyModel.getAgency(query);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }

  // get single agency
  public async getSingle(req: Request) {
    const { id } = req.params;
    const agencyModel = this.Model.agencyModel();

    const data = await agencyModel.getSingleAgency(Number(id));

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const query = req.query;
    const users = await agencyModel.getUser({
      agency_id: Number(id),
      ...query,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: {
        ...data[0],
        users,
      },
    };
  }

  // update single agency
  public async update(req: Request) {
    const body = req.body;
    const { id } = req.params;

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      body["agency_logo"] = files[0].filename;
    }

    const agencyModel = this.Model.agencyModel();
    await agencyModel.updateAgency(body, Number(id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: {
        agency_logo: body.agency_logo,
      },
    };
  }

  // create agency user
  public async createUser(req: Request) {
    const { agency_id, name, email, password, mobile_number } = req.body;
    const userModel = this.Model.agencyModel();
    const checkEmail = await userModel.getSingleUser({ email });
    const files = (req.files as Express.Multer.File[]) || [];

    if (checkEmail.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: "Email already exist.",
      };
    }

    const hashed_password = await Lib.hashPass(password);

    const userBody: any = {
      name,
      email,
      hashed_password,
      mobile_number,
      agency_id,
    };

    if (files.length) {
      userBody["photo"] = files[0].filename;
    }

    const newUser = await userModel.createAgencyUser(userBody);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: {
        id: newUser[0].id,
        photo: userBody.photo,
      },
    };
  }

  // update agency user
  public async updateUser(req: Request) {
    const { id } = req.params;
    const userModel = this.Model.agencyModel();
    const checkEmail = await userModel.getSingleUser({ id: Number(id) });
    const files = (req.files as Express.Multer.File[]) || [];

    if (!checkEmail.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const userBody: any = {
      ...req.body,
    };

    if (files.length) {
      userBody["photo"] = files[0].filename;
    }

    await userModel.updateAgencyUser(userBody, Number(id));

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
