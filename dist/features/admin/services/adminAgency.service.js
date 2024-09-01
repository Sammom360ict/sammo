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
exports.AdminAgencyService = void 0;
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
class AdminAgencyService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //deposit to agency
    depositToAgency(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const body = req.body;
            body.created_by = id;
            body.type = "credit";
            const model = this.Model.agencyModel();
            const res = yield model.insertAgencyDeposit(body);
            if (res) {
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
    //get list
    getAllDepositRequestList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, status } = req.query;
            const data = yield this.Model.agencyModel().getAllAgencyDepositRequest({
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
    //get list
    updateDepositRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status: bdy_status } = req.body;
            const model = this.Model.agencyModel();
            // get single deposit
            const data = yield model.getSingleDeposit({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { status, amount, agency_id } = data[0];
            console.log({ data });
            if (status == "pending" && bdy_status == "approved") {
                console.log("first");
                yield model.insertAgencyDeposit({
                    type: "credit",
                    amount,
                    agency_id,
                    created_by: req.admin.id,
                });
                yield model.updateAgencyDepositRequest({
                    status: bdy_status,
                }, { id: parseInt(id), agency_id });
            }
            else {
                yield model.updateAgencyDepositRequest({
                    status: bdy_status,
                }, { id: parseInt(id), agency_id });
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Updated Succesfully",
            };
        });
    }
    //get transaction
    getTransaction(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.agencyModel();
            const { start_date, end_date, limit, skip } = req.query;
            const data = yield model.getAgencyTransactions({
                agency_id: Number(id),
                start_date: start_date,
                end_date: end_date,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    // Create agency
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.admin;
                const { agency_name, agency_email, agency_phone, user_name, user_email, user_password, user_phone, } = req.body;
                const files = req.files || [];
                const agencyModel = this.Model.agencyModel(trx);
                const agencyBody = {
                    agency_name,
                    email: agency_email,
                    phone: agency_phone,
                    created_by: admin_id,
                };
                const checkEmail = yield agencyModel.getSingleUser({ email: user_email });
                if (checkEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Email already exist.",
                    };
                }
                const hashed_password = yield lib_1.default.hashPass(user_password);
                const userBody = {
                    name: user_name,
                    email: user_email,
                    hashed_password,
                    mobile_number: user_phone,
                };
                files.forEach((item) => {
                    if (item.fieldname === "agency_logo") {
                        agencyBody["agency_logo"] = item.filename;
                    }
                    else if (item.fieldname === "user_photo") {
                        userBody["photo"] = item.filename;
                    }
                });
                const agency = yield agencyModel.createAgency(agencyBody);
                userBody["agency_id"] = agency[0].id;
                // let btocToken = '';
                // if (btoc_commission) {
                //   btocToken = uuidv4();
                //   await agencyModel.insertAgencyBtoCToken({
                //     agency_id: agency[0],
                //     token: btocToken,
                //   });
                // }
                yield agencyModel.createAgencyUser(userBody);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: {
                        id: agency[0].id,
                        agency_logo: agencyBody.agency_logo,
                        user_photo: userBody.photo,
                    },
                };
            }));
        });
    }
    // get agency
    get(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const agencyModel = this.Model.agencyModel();
            const { data, total } = yield agencyModel.getAgency(query);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get single agency
    getSingle(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const agencyModel = this.Model.agencyModel();
            const data = yield agencyModel.getSingleAgency(Number(id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const query = req.query;
            const users = yield agencyModel.getUser(Object.assign({ agency_id: Number(id) }, query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { users }),
            };
        });
    }
    // update single agency
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { id } = req.params;
            const files = req.files || [];
            if (files.length) {
                body["agency_logo"] = files[0].filename;
            }
            const agencyModel = this.Model.agencyModel();
            yield agencyModel.updateAgency(body, Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: {
                    agency_logo: body.agency_logo,
                },
            };
        });
    }
    // create agency user
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { agency_id, name, email, password, mobile_number } = req.body;
            const userModel = this.Model.agencyModel();
            const checkEmail = yield userModel.getSingleUser({ email });
            const files = req.files || [];
            if (checkEmail.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: "Email already exist.",
                };
            }
            const hashed_password = yield lib_1.default.hashPass(password);
            const userBody = {
                name,
                email,
                hashed_password,
                mobile_number,
                agency_id,
            };
            if (files.length) {
                userBody["photo"] = files[0].filename;
            }
            const newUser = yield userModel.createAgencyUser(userBody);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: {
                    id: newUser[0].id,
                    photo: userBody.photo,
                },
            };
        });
    }
    // update agency user
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const userModel = this.Model.agencyModel();
            const checkEmail = yield userModel.getSingleUser({ id: Number(id) });
            const files = req.files || [];
            if (!checkEmail.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const userBody = Object.assign({}, req.body);
            if (files.length) {
                userBody["photo"] = files[0].filename;
            }
            yield userModel.updateAgencyUser(userBody, Number(id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.AdminAgencyService = AdminAgencyService;
