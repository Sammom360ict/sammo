import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
export class AdminBtoBBookingServiceService extends AbstractServices {
  constructor() {
    super();
  }
  //get list
  public async getList(req: Request) {
    const { limit, skip, status } = req.query as unknown as {
      limit: number;
      skip: number;
      status: string;
    };
    const model = this.Model.btobBookingSupportModel();
    const data = await model.getList(undefined, status, limit, skip);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }
  //get details
  public async getDetails(req: Request) {
    const { limit, skip } = req.query as unknown as {
      limit: number;
      skip: number;
    };
    const { id: support_id } = req.params;
    const model = this.Model.btobBookingSupportModel();
    const support_data = await model.getSingleSupport({
      id: Number(support_id),
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
    const { id } = req.admin;
    const { id: support_id } = req.params;
    const model = this.Model.btobBookingSupportModel();
    const support_data = await model.getSingleSupport({
      id: Number(support_id),
    });
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
      sender: "admin",
      sender_id: id,
    });
    //update last message time
    await model.updateSupport(
      {
        last_message_at: new Date(),
        status: support_data[0].status === "pending" ? "processing" : undefined,
      },
      Number(support_id)
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data: attachmentsJSON,
    };
  }
  //close support
  public async closeSupport(req: Request) {
    const { id: user_id } = req.admin;
    const { id: support_id } = req.params;
    const model = this.Model.btobBookingSupportModel();
    const booking_model = this.Model.btocFlightBookingModel();
    const support_data = await model.getSingleSupport({
      id: Number(support_id),
    });
    if (!support_data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    await model.updateSupport(
      { status: req.body.status, closed_by: user_id, closed_at: new Date() },
      Number(support_id)
    );
    if (req.body.status === "approved") {
      if (support_data[0].support_type === "DateChange") {
        await booking_model.updateBooking(
          {
            status: "ticket-reissued",
          },
          support_data[0].booking_id
        );
      } else if (support_data[0].support_type === "Refund") {
        await booking_model.updateBooking(
          {
            status: "ticket-refund",
          },
          support_data[0].booking_id
        );
      } else if (support_data[0].support_type === "VOID") {
        await booking_model.updateBooking(
          {
            status: "ticket-void",
          },
          support_data[0].booking_id
        );
      }
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
    };
  }
}
