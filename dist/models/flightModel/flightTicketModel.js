"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class FlightTicketModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // get single issue ticket
    getSingleIssueTicket(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_ticket_issue")
                .withSchema(this.BTOC_SCHEMA)
                .select("*")
                .where({ flight_booking_id });
        });
    }
    //get ticket segment
    getTicketSegment(flight_booking_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_ticket_issue_segment")
                .withSchema(this.BTOC_SCHEMA)
                .select("*")
                .where({ flight_booking_id });
        });
    }
    //create flight ticket issue info
    createFlightTicketIssue(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_ticket_issue")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload, "id");
        });
    }
    //create flight ticket segment info
    createFlightTicketSegment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_ticket_issue_segment")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload, "id");
        });
    }
}
exports.default = FlightTicketModel;
