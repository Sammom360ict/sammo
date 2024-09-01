import { Request, Response } from "express";
import AbstractController from "../../../abstract/abstract.controller";
import TicketIssueService from "../services/ticketIssue.service";
export class ticketIssueController extends AbstractController {
  private service = new TicketIssueService();

  public ticketIssue = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.service.ticketIssue(req);
      res.status(code).json(rest);
    }
  );
}
