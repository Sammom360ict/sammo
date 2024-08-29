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
class BookingTravelerService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create traveler service
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.user;
            // const files = (req.files as Express.Multer.File[]) || [];
            // files.forEach((file) => {
            //   if (file.fieldname === 'passport_file') {
            //     body[file.fieldname] = file.filename;
            //   } else {
            //     throw new CustomError('Invalid file field', 422);
            //   }
            // });
            const model = this.Model.travelerModel();
            const traveler_body = {
                user_id: id,
                type: body.type,
                title: body.reference,
                first_name: body.mid_name,
                sur_name: body.sur_name,
                date_of_birth: body.date_of_birth,
                passport_number: body.passport_number,
                passport_expiry_date: body.passport_expire_date,
                city: body.city,
                email: body.email,
                mobile_number: body.phone,
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
            const { id } = req.user;
            const model = this.Model.travelerModel();
            const { data, total } = yield model.getTraveler(Object.assign(Object.assign({}, query), { deleted: false, user_id: id }), true);
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
            const { id: user_id } = req.user;
            const model = this.Model.travelerModel();
            const data = yield model.getSingleTraveler({
                id: Number(id),
                deleted: false,
                user_id,
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    // update traveler service
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.params;
            const { id: user_id } = req.user;
            // const files = (req.files as Express.Multer.File[]) || [];
            // files.forEach((file) => {
            //   if (file.fieldname === 'passport_file') {
            //     body[file.fieldname] = file.filename;
            //   } else {
            //     throw new CustomError('Invalid file field', 422);
            //   }
            // });
            const model = this.Model.travelerModel();
            const check = yield model.getSingleTraveler({
                id: Number(id),
                deleted: false,
                user_id,
            });
            if (!check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const traveler_body = {
                type: body.type,
                title: body.reference,
                first_name: body.mid_name,
                sur_name: body.sur_name,
                date_of_birth: body.date_of_birth,
                passport_number: body.passport_number,
                passport_expiry_date: body.passport_expire_date,
                city: body.city,
                email: body.email,
                mobile_number: body.phone,
                frequent_flyer_airline: body.frequent_flyer_airline,
                frequent_flyer_number: body.frequent_flyer_number,
                gender: body.gender,
                country_id: body.country,
                status: body.status,
            };
            yield model.updateTraveler(traveler_body, Number(id));
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
            const { id: user_id } = req.user;
            const model = this.Model.travelerModel();
            const check = yield model.getSingleTraveler({
                id: Number(id),
                deleted: false,
                user_id,
            });
            if (!check.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            yield model.deleteTraveler(Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.default = BookingTravelerService;
