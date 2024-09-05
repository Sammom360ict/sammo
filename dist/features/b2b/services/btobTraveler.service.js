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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
class BtobTravelerService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create traveler service
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { agency_id } = req.agency;
            const model = this.Model.agencyModel();
            const traveler_body = {
                agency_id,
                type: body.type,
                reference: body.reference,
                first_name: body.mid_name,
                sur_name: body.sur_name,
                date_of_birth: body.date_of_birth,
                passport_number: body.passport_number,
                passport_expire_date: body.passport_expire_date,
                city: body.city,
                email: body.email,
                phone: body.phone,
                frequent_flyer_airline: body.frequent_flyer_airline,
                frequent_flyer_number: body.frequent_flyer_number,
                gender: body.gender,
                country_id: body.country,
            };
            yield model.insertTraveler(traveler_body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get traveler service
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const { agency_id } = req.agency;
            const model = this.Model.agencyModel();
            const { data, total } = yield model.getAllTravelers(Object.assign(Object.assign({}, query), { deleted: false, agency_id }));
            return {
                success: true,
                data,
                total,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // get single traveler service
    getSingle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { agency_id } = req.agency;
            const model = this.Model.agencyModel();
            const data = yield model.getSingleTravelers(agency_id, Number(id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                data: data[0],
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    // update traveler service
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.params;
            const { agency_id } = req.agency;
            // const files = (req.files as Express.Multer.File[]) || [];
            // files.forEach((file) => {
            //   if (file.fieldname === 'passport_file') {
            //     body[file.fieldname] = file.filename;
            //   } else {
            //     throw new CustomError('Invalid file field', 422);
            //   }
            // });
            const model = this.Model.agencyModel();
            const check = yield model.getSingleTravelers(agency_id, Number(id));
            if (!check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const traveler_body = {
                type: body.type,
                reference: body.reference,
                first_name: body.mid_name,
                sur_name: body.sur_name,
                date_of_birth: body.date_of_birth,
                passport_number: body.passport_number,
                passport_expire_date: body.passport_expire_date,
                city: body.city,
                email: body.email,
                phone: body.phone,
                frequent_flyer_airline: body.frequent_flyer_airline,
                frequent_flyer_number: body.frequent_flyer_number,
                gender: body.gender,
                status: body.status,
                country_id: body.country,
            };
            yield model.updateTravelers(agency_id, Number(id), traveler_body);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //delete traveler service
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { id: user_id, agency_id } = req.agency;
            const model = this.Model.agencyModel();
            const check = yield model.getSingleTravelers(agency_id, Number(id));
            if (!check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            yield model.deleteTraveler(agency_id, Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.default = BtobTravelerService;
