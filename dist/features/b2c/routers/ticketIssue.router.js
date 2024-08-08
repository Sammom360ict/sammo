"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const ticketIssue_controller_1 = require("../controllers/ticketIssue.controller");
class ticketIssueRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new ticketIssue_controller_1.ticketIssueController();
        this.callRouter();
    }
    callRouter() {
        this.router.route("/:id")
            .post(this.controller.ticketIssue);
    }
}
exports.default = ticketIssueRouter;
