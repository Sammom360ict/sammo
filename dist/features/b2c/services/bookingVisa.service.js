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
exports.BookingVisaService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class BookingVisaService extends abstract_service_1.default {
    //create visa application
    createVisaApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction(((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, first_name, last_name } = req.user;
                const model = this.Model.VisaModel(trx);
                const body = req.body;
                const { visa_id } = body;
                const data = yield model.single(visa_id, true);
                if (!data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const payable = (Number(data[0].visa_fee) + Number(data[0].processing_fee)) * Number(body.traveler);
                const application_body = {
                    user_id: id,
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
                    residence: body.residence
                };
                const create_application = yield model.b2cCreateApplication(application_body);
                if (create_application.length) {
                    let traveler_body = [];
                    traveler_body = body.passengers.map((obj) => {
                        return Object.assign(Object.assign({}, obj), { application_id: create_application[0].id });
                    });
                    yield model.b2cCreateTraveler(traveler_body);
                    const tracking_body = {
                        application_id: create_application[0].id,
                        status: 'pending',
                        details: `${first_name} ${last_name} has applied for the visa`,
                    };
                    yield model.b2cCreateTracking(tracking_body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
                    };
                }
            })));
        });
    }
    //get list 
    getApplicationList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.user;
            const model = this.Model.VisaModel();
            const { limit, skip } = req.query;
            const data = yield model.getB2CApplication({ user_id: id, limit: limit ? Number(limit) : 100, skip: skip ? Number(skip) : 0 }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data
            };
        });
    }
    //get single
    getSingleApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: user_id } = req.user;
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2cSingleApplication(Number(id), user_id);
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const traveler_data = yield model.b2cTravelerList(Number(id));
            const tracking_data = yield model.b2cTrackingList(Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { traveler_data, tracking_data })
            };
        });
    }
}
exports.BookingVisaService = BookingVisaService;
