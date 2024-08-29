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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controller_1 = __importDefault(require("../../../abstract/abstract.controller"));
const administration_service_1 = __importDefault(require("../services/administration.service"));
const administration_validator_1 = __importDefault(require("../utils/validators/administration.validator"));
class AdministrationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.AdministrationService = new administration_service_1.default();
        this.AdministrationValidator = new administration_validator_1.default();
        //create role
        this.createRole = this.asyncWrapper.wrap({ bodySchema: this.AdministrationValidator.createRole }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.AdministrationService.createRole(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //role list
        this.roleList = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.AdministrationService.roleList(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //create permission
        this.createPermission = this.asyncWrapper.wrap({ bodySchema: this.AdministrationValidator.createPermission }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.AdministrationService.createPermission(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //permission list
        this.permissionList = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.AdministrationService.permissionList(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get single role permission
        this.getSingleRolePermission = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.AdministrationService.getSingleRolePermission(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //update role permission
        this.updateRolePermissions = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.AdministrationValidator.updateRolePermissions,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.AdministrationService.updateRolePermissions(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //create admin
        this.createAdmin = this.asyncWrapper.wrap({
            bodySchema: this.AdministrationValidator.createAdmin,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.AdministrationService.createAdmin(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //get all admin
        this.getAllAdmin = this.asyncWrapper.wrap({ querySchema: this.AdministrationValidator.getAllAdminQueryValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.AdministrationService.getAllAdmin(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get single admin
        this.getSingleAdmin = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.AdministrationService.getSingleAdmin(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //update admin
        this.updateAdmin = this.asyncWrapper.wrap({ bodySchema: this.AdministrationValidator.updateAdmin }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.AdministrationService.updateAdmin(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //get users
        this.getUsers = this.asyncWrapper.wrap({ querySchema: this.AdministrationValidator.getUsersFilterValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.AdministrationService.getUsers(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        //get user single
        this.getSingleUser = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.AdministrationService.getSingleUser(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        //edit user profile
        this.editUserProfile = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.AdministrationValidator.editUserProfileValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.AdministrationService.editUserProfile(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        //create city
        this.createCity = this.asyncWrapper.wrap({ bodySchema: this.AdministrationValidator.createCityValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.AdministrationService.createCity(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdministrationController;
