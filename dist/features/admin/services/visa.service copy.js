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
exports.AdminVisaService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class AdminVisaService extends abstract_service_1.default {
    //create visa
    createVisa(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.VisaModel();
            const body = req.body;
            body.created_by = id;
            const create = yield model.create(body);
            if (create.length) {
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
    //get visa
    getVisa(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.VisaModel();
            const data = yield model.get(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get single visa
    getSingleVisa(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.single(Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //update visa
    updateVisa(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const res = yield model.update(req.body, Number(id));
            if (res) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: req.body,
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
    //////-------b2c-----------//
    //get b2c applications
    getB2CApplications(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.VisaModel();
            const data = yield model.getB2CApplication(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get b2c single application
    getB2CSingleApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2cSingleApplication(Number(id));
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
                data: Object.assign(Object.assign({}, data[0]), { traveler_data, tracking_data }),
            };
        });
    }
    //create b2c tracking of application
    createB2CTrackingOfApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2cSingleApplication(Number(id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            req.body.application_id = id;
            const create_tracking = yield model.b2cCreateTracking(req.body);
            if (create_tracking.length) {
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
    //--------b2b-----------//
    //get b2b applications
    getB2BApplications(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.VisaModel();
            const data = yield model.getB2BApplication(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get b2b single application
    getB2BSingleApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2bSingleApplication(Number(id));
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
    //create b2b tracking of application
    createB2BTrackingOfApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.VisaModel();
            const data = yield model.b2bSingleApplication(Number(id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            req.body.application_id = id;
            const create_tracking = yield model.b2bCreateTracking(req.body);
            if (create_tracking.length) {
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
}
exports.AdminVisaService = AdminVisaService;
