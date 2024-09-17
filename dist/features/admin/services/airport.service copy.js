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
exports.AirportService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AirportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //insert airport
    insertAirport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const model = this.Model.commonModel();
            const checkAirport = yield model.getAllAirport({ code: body.iata_code }, false);
            console.log({ body });
            if (checkAirport.data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Airport code already exist.",
                };
            }
            yield model.insertAirport(body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    //get all airport
    getAllAirport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { country_id, name, limit, skip } = req.query;
            const model = this.Model.commonModel();
            const get_airport = yield model.getAllAirport({ country_id, name, limit, skip }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: parseInt(get_airport.total),
                data: get_airport.data,
            };
        });
    }
    //update airport
    updateAirport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const airport_id = req.params.id;
            const body = req.body;
            const model = this.Model.commonModel();
            const update_airport = yield model.updateAirport(body, Number(airport_id));
            if (update_airport > 0) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }
        });
    }
    //delete airport
    deleteAirport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const airport_id = req.params.id;
            const model = this.Model.commonModel();
            const del_airport = yield model.deleteAirport(Number(airport_id));
            if (del_airport > 0) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }
        });
    }
}
exports.AirportService = AirportService;
