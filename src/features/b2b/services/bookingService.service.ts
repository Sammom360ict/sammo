import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
export class BtoBBookingServiceService extends AbstractServices {
  constructor() {
    super();
  }
  //create support
  public async createSupport(req: Request) {
    const { id, agency_id } = req.agency;
    const { booking_id, support_type, ticket_number, message } = req.body;

    const booking_model = this.Model.flightBookingModel();

    const booking_data = await booking_model.getSingleFlightBooking({
      id: Number(booking_id),
      agency_id,
    });
    if (!booking_data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const support_model = this.Model.btobBookingSupportModel();

    // insert support
    const support_res = await support_model.insertSupport({
      booking_id: Number(booking_id),
      support_type,
      created_by: id,
    });

    const ticket_body = ticket_number.map((element: any) => {
      return {
        support_id: support_res[0],
        traveler_id: element.traveler_id,
        ticket_number: element.ticket_number,
      };
    });

    // insert support ticket
    await support_model.insertSupportTicket(ticket_body);

    const files = (req.files as Express.Multer.File[]) || [];
    const attachments: { type: string; file: string }[] = [];
    if (files?.length) {
      for (const element of files) {
        let type = element.mimetype.split("/")[0];
        if (type === "application") {
          type = "file";
        }
        const file = element.filename;
        attachments.push({ type, file });
      }
    }
    const attachmentsJSON = JSON.stringify(attachments);

    // insert support message
    await support_model.insertSupportMessage({
      support_id: support_res[0],
      message,
      attachment: attachmentsJSON,
      sender: "agent",
      sender_id: id,
    });

    // audit trail
    const auditTrailModel = this.Model.auditTrailModel();
    await auditTrailModel.createBtoBAudit({
      agency_id: agency_id,
      created_by: id,
      type: "create",
      details: `created a ${support_type} support of pnr: ${booking_data[0].pnr_code}`,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: { id: support_res[0], attachmentsJSON },
    };
  }
  //get list
  public async getList(req: Request) {
    const { id, agency_id } = req.agency;
    const { limit, skip, status } = req.query as unknown as {
      limit: number;
      skip: number;
      status: string;
    };
    const model = this.Model.btobBookingSupportModel();
    const data = await model.getList(id, status, limit, skip);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }
  //get details
  public async getDetails(req: Request) {
    const { id: user_id, agency_id } = req.agency;
    const { limit, skip } = req.query as unknown as {
      limit: number;
      skip: number;
    };
    const { id: support_id } = req.params;
    const model = this.Model.btobBookingSupportModel();
    const support_data = await model.getSingleSupport({
      id: Number(support_id),
      agent_id: user_id,
    });
    if (!support_data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const ticket_data = await model.getTickets(Number(support_id));
    const message_data = await model.getMessages({
      limit,
      skip,
      support_id: Number(support_id),
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: {
        ...support_data[0],
        ticket_data,
        total_message: message_data.total,
        message_data: message_data.data,
      },
    };
  }
  //create message
  public async createMessage(req: Request) {
    const { id, agency_id } = req.agency;
    const { id: support_id } = req.params;
    const model = this.Model.btobBookingSupportModel();
    const support_data = await model.getSingleSupport({
      id: Number(support_id),
      agent_id: id,
      notStatus: "closed",
    });
    if (!support_data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
    const files = (req.files as Express.Multer.File[]) || [];
    const attachments: { type: string; file: string }[] = [];
    if (files?.length) {
      for (const element of files) {
        let type = element.mimetype.split("/")[0];
        if (type === "application") {
          type = "file";
        }
        const file = element.filename;
        attachments.push({ type, file });
      }
    }
    const attachmentsJSON = JSON.stringify(attachments);
    await model.insertSupportMessage({
      support_id: Number(support_id),
      message: req.body.message,
      attachment: attachmentsJSON,
      sender: "agent",
      sender_id: id,
    });
    //update last message time
    await model.updateSupport(
      { last_message_at: new Date() },
      Number(support_id)
    );
    const auditTrailModel = this.Model.auditTrailModel();
    await auditTrailModel.createBtoBAudit({
      agency_id: agency_id,
      created_by: id,
      type: "create",
      details: `created a message in support id ${support_id}`,
    });
    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: attachmentsJSON,
    };
  }
  // //close support
  // public async closeSupport(req: Request) {
  //     const { id, agency_id } = req.agency;
  //     const {id:support_id} = req.params;
  //     const model = this.Model.btobBookingSupportModel();
  //     const support_data = await model.getSingleSupport({ id: Number(support_id), agent_id: id, notStatus: 'closed'  });
  //     if (!support_data.length) {
  //         return {
  //             success: false,
  //             code: this.StatusCode.HTTP_BAD_REQUEST,
  //             message: this.ResMsg.HTTP_BAD_REQUEST
  //         }
  //     }
  //     await model.updateSupport({status:'closed'}, Number(support_id));
  //     const auditTrailModel = this.Model.auditTrailModel();
  //     await auditTrailModel.createBtoBAudit({agency_id:agency_id,created_by: id, type: "delete", details: `closed support id ${support_id}`});
  //     return{
  //         success: true,
  //         code: this.StatusCode.HTTP_OK,
  //         message: this.ResMsg.HTTP_OK
  //     }
  // }
}
