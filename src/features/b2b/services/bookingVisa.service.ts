import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { ICreateAppTravelerPayload } from "../../../utils/interfaces/visa/visa.interface";

export class B2BVisaService extends AbstractServices {
  //create visa application
  public async createVisaApplication(req: Request) {
    return await this.db.transaction(async (trx) => {
      const { id, agency_id, name } = req.agency;
      const model = this.Model.VisaModel(trx);
      const body = req.body;
      const { visa_id } = body;
      const data = await model.single(visa_id, true);
      if (!data.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_NOT_FOUND,
          message: this.ResMsg.HTTP_NOT_FOUND,
        };
      }
      const payable =
        (Number(data[0].visa_fee) + Number(data[0].processing_fee)) *
        Number(body.traveler);
      const application_body = {
        agency_id: agency_id,
        agent_id: id,
        visa_id: visa_id,
        from_date: body.from_date,
        to_date: body.to_date,
        traveler: body.traveler,
        visa_fee: data[0].visa_fee,
        processing_fee: data[0].processing_fee,
        payable: payable,
        application_date: new Date(),
        contact_email: body.contact_email,
        contact_number: body.contact_number,
        whatsapp_number: body.whatsapp_number,
        nationality: body.nationality,
        residence: body.residence,
      };

      const create_application = await model.b2bCreateApplication(
        application_body
      );
      if (create_application.length) {
        let traveler_body: ICreateAppTravelerPayload[] = [];
        traveler_body = body.passengers.map((obj: any) => {
          return { ...obj, application_id: create_application[0].id };
        });
        await model.b2bCreateTraveler(traveler_body);

        const tracking_body = {
          application_id: create_application[0].id,
          status: "pending",
          details: `${name} has applied for the visa`,
        };
        await model.b2bCreateTracking(tracking_body);

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
    });
  }

  //get list
  public async getApplicationList(req: Request) {
    const { id } = req.agency;
    const model = this.Model.VisaModel();
    const { limit, skip } = req.query;
    const data = await model.getB2BApplication(
      {
        agent_id: id,
        limit: limit ? Number(limit) : 100,
        skip: skip ? Number(skip) : 0,
      },
      true
    );
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
