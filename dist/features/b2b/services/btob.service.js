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
exports.BtobService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class BtobService extends abstract_service_1.default {
    //create visa application
    insertDeposit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files || [];
            if (files.length) {
                req.body["doc"] = files[0].filename;
            }
            yield this.Model.agencyModel().insertAgencyDepositRequest(Object.assign(Object.assign({}, req.body), { agency_id: req.agency.agency_id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    //get list
    getAllDepositRequestList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { agency_id } = req.agency;
            const { limit, skip, status } = req.query;
            const data = yield this.Model.agencyModel().getAllAgencyDepositRequest({
                agency_id,
                limit: Number(limit),
                skip: Number(skip),
                status: status,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get single
    getSingleApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: agent_id } = req.agency;
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2bSingleApplication(Number(id), agent_id);
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const traveler_data = yield model.b2bTravelerList(Number(id));
            const tracking_data = yield model.b2bTrackingList(Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { traveler_data, tracking_data }),
            };
        });
    }
}
exports.BtobService = BtobService;
