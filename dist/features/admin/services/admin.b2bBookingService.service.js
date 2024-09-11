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
exports.AdminBtoBBookingServiceService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AdminBtoBBookingServiceService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //get list
    getList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status } = req.query;
            const model = this.Model.btobBookingSupportModel();
            const data = yield model.getList(undefined, status, limit, skip);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get details
    getDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const { id: support_id } = req.params;
            const model = this.Model.btobBookingSupportModel();
            const support_data = yield model.getSingleSupport({
                id: Number(support_id),
            });
            if (!support_data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const ticket_data = yield model.getTickets(Number(support_id));
            const message_data = yield model.getMessages({
                limit,
                skip,
                support_id: Number(support_id),
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, support_data[0]), { ticket_data, total_message: message_data.total, message_data: message_data.data }),
            };
        });
    }
    //create message
    createMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const { id: support_id } = req.params;
            const model = this.Model.btobBookingSupportModel();
            const support_data = yield model.getSingleSupport({
                id: Number(support_id),
            });
            const files = req.files || [];
            const attachments = [];
            if (files === null || files === void 0 ? void 0 : files.length) {
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
            yield model.insertSupportMessage({
                support_id: Number(support_id),
                message: req.body.message,
                attachment: attachmentsJSON,
                sender: "admin",
                sender_id: id,
            });
            //update last message time
            yield model.updateSupport({
                last_message_at: new Date(),
                status: support_data[0].status === "pending" ? "processing" : undefined,
            }, Number(support_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: attachmentsJSON,
            };
        });
    }
    //close support
    closeSupport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.admin;
            const { id: support_id } = req.params;
            const model = this.Model.btobBookingSupportModel();
            const booking_model = this.Model.btocFlightBookingModel();
            const support_data = yield model.getSingleSupport({
                id: Number(support_id),
            });
            if (!support_data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            yield model.updateSupport({ status: req.body.status, closed_by: user_id, closed_at: new Date() }, Number(support_id));
            if (req.body.status === "approved") {
                if (support_data[0].support_type === "DateChange") {
                    yield booking_model.updateBooking({
                        status: "ticket-reissued",
                    }, support_data[0].booking_id);
                }
                else if (support_data[0].support_type === "Refund") {
                    yield booking_model.updateBooking({
                        status: "ticket-refund",
                    }, support_data[0].booking_id);
                }
                else if (support_data[0].support_type === "VOID") {
                    yield booking_model.updateBooking({
                        status: "ticket-void",
                    }, support_data[0].booking_id);
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.AdminBtoBBookingServiceService = AdminBtoBBookingServiceService;
