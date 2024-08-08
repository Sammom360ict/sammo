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
exports.AirlinesCommissionService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AirlinesCommissionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create airlines commission service
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.admin;
            const model = this.Model.AirlineCommissionModel();
            const check = yield model.get({ check_code: body.airline_code });
            if (check.data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: 'Airline code already exist!',
                };
            }
            yield model.insert(Object.assign(Object.assign({}, body), { updated_by: id }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get airlines commission service
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const model = this.Model.AirlineCommissionModel();
            const { data, total } = yield model.get(query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // update airlines commission service
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.admin;
            const { code } = req.params;
            const model = this.Model.AirlineCommissionModel();
            if (body.soto_allowed === 0) {
                body.soto_commission = 0.00;
            }
            yield model.update(Object.assign(Object.assign({}, body), { updated_by: id, last_updated: new Date() }), code);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // delete airlines commission service
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            const model = this.Model.AirlineCommissionModel();
            yield model.delete(code);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.AirlinesCommissionService = AirlinesCommissionService;
