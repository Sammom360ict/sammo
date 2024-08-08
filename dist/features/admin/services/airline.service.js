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
exports.AirlinesService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AirlinesService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //insert airline
    insertAirlines(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const body = req.body;
            const model = this.Model.commonModel();
            const insert_airline = yield model.insertAirline(body);
            if (insert_airline.length) {
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
        });
    }
    //update airline
    updateAirlines(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const airlines_id = req.params.id;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const body = req.body;
            const model = this.Model.commonModel();
            const update_airline = yield model.updateAirlines(body, Number(airlines_id));
            if (update_airline > 0) {
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
    //delete airline
    deleteAirlines(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const airlines_id = req.params.id;
            const model = this.Model.commonModel();
            const del_airline = yield model.deleteAirlines(Number(airlines_id));
            if (del_airline > 0) {
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
exports.AirlinesService = AirlinesService;
