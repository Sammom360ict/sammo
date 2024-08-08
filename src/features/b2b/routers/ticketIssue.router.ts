import AbstractRouter from "../../../abstract/abstract.router";
import { ticketIssueController } from "../controllers/ticketIssue.controller";

export default class ticketIssueRouter extends AbstractRouter{
    private controller = new ticketIssueController();
    constructor(){
        super();
        this.callRouter();
    }

    private callRouter(){
        this.router.route("/:id")
        .post(this.controller.ticketIssue);
    }
}