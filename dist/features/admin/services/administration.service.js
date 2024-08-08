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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
class AdministrationService extends abstract_service_1.default {
    //create role
    createRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.administrationModel();
            const { role_name } = req.body;
            const check_name = yield model.getSingleRole(undefined, role_name);
            if (check_name.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.ROLE_NAME_EXIST,
                };
            }
            const create_role = yield model.createRole({ name: role_name, created_by: id });
            if (create_role.length) {
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
    //role list
    roleList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const model = this.Model.administrationModel();
            const role_list = yield model.roleList(Number(limit), Number(skip), true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: role_list.total,
                data: role_list.data
            };
        });
    }
    //create permission
    createPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.administrationModel();
            const check_name = yield model.permissionsList({ name: req.body.permission_name });
            if (check_name.data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.PERMISSION_NAME_EXIST,
                };
            }
            const create_permission = yield model.createPermission({ name: req.body.permission_name, created_by: id });
            if (create_permission.length) {
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
    //permission list
    permissionList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip } = req.query;
            const model = this.Model.administrationModel();
            const permission_list = yield model.permissionsList({ limit: Number(limit), skip: Number(skip) }, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: permission_list.total,
                data: permission_list.data
            };
        });
    }
    //get single role permission
    getSingleRolePermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const role_id = req.params.id;
            const model = this.Model.administrationModel();
            const role_permission = yield model.getSingleRole(Number(role_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: role_permission,
            };
        });
    }
    //update role permission
    updateRolePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const role_id = req.params.id;
                const model = this.Model.administrationModel(trx);
                const { add_permissions, remove_permissions } = req.body;
                if (add_permissions && add_permissions.length) {
                    for (const add_permission of add_permissions) {
                        const check_role_permission = yield model.getRolePermissions(Number(role_id), Number(add_permission));
                        console.log(check_role_permission);
                        if (check_role_permission.length) {
                            yield trx.rollback({
                                success: false,
                                code: this.StatusCode.HTTP_CONFLICT,
                                message: this.ResMsg.PERMISSION_EXISTS_FOR_ROLE,
                            });
                        }
                        yield model.createRolePermission({ role_id: Number(role_id), permission_id: add_permission });
                    }
                }
                if (remove_permissions && remove_permissions.length) {
                    for (const remove_permission of remove_permissions) {
                        const check_role_permission = yield model.getRolePermissions(Number(role_id), Number(remove_permission));
                        if (!check_role_permission.length) {
                            yield trx.rollback({
                                success: false,
                                code: this.StatusCode.HTTP_NOT_FOUND,
                                message: this.ResMsg.PERMISSION_NOT_FOUND_FOR_ROLE,
                            });
                        }
                        yield model.deleteRolePermission({ role_id: Number(role_id), permission_id: remove_permission });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    createAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const _a = req.body, { password, email, phone_number, username } = _a, rest = __rest(_a, ["password", "email", "phone_number", "username"]);
            const model = this.Model.adminModel();
            //check admins email and phone number
            const check_admin = yield model.getSingleAdmin({ email, phone_number, username });
            if (check_admin.length) {
                if (check_admin[0].email === email) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.EMAIL_EXISTS,
                    };
                }
                else if (check_admin[0].username === username) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.USERNAME_EXISTS,
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.PHONE_EXISTS,
                    };
                }
            }
            rest.email = email;
            rest.phone_number = phone_number;
            rest.created_by = id;
            rest.username = username;
            //password hashing
            const hashedPass = yield lib_1.default.hashPass(password);
            //create admin
            const create_admin = yield model.createAdmin(Object.assign({ password_hash: hashedPass }, rest));
            if (create_admin.length) {
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
    //get all admin
    getAllAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.adminModel();
            const data = yield model.getAllAdmin(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: data.total,
                data: data.data,
            };
        });
    }
    //get single admin
    getSingleAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.adminModel();
            const data = yield model.getSingleAdmin({ id: Number(id) });
            if (data.length) {
                delete data[0].password_hash;
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //update admin
    updateAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const model = this.Model.adminModel();
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            if (req.body.username) {
                const check_username = yield model.getSingleAdmin({ username: req.body.username });
                if (check_username.length) {
                    if (Number(check_username[0].id) !== Number(id)) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: this.ResMsg.USERNAME_EXISTS,
                        };
                    }
                }
            }
            if (req.body.phone_number) {
                const check_phone = yield model.getSingleAdmin({ phone_number: req.body.phone_number });
                if (check_phone.length) {
                    if (Number(check_phone[0].id) !== Number(id)) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: this.ResMsg.PHONE_EXISTS,
                        };
                    }
                }
            }
            const res = yield model.updateUserAdmin(req.body, { id: Number(id) });
            if (res) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: req.body
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
    //get users
    getUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.userModel();
            const data = yield model.list(req.query, true);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data.data,
                total: data.total
            };
        });
    }
    //get user details
    getSingleUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const model = this.Model.userModel();
            const data = yield model.getProfileDetails({ id });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = data[0], { password_hash } = _a, rest = __rest(_a, ["password_hash"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: rest
            };
        });
    }
    //edit user profile
    editUserProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const files = req.files || [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                req.body[files[0].fieldname] = files[0].filename;
            }
            const { username, first_name, last_name, gender, photo, status } = req.body;
            const model = this.Model.userModel();
            if (req.body.username) {
                const check_username = yield model.getProfileDetails({ username: req.body.username });
                if (check_username.length) {
                    if (Number(check_username[0].id) !== Number(id)) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: this.ResMsg.USERNAME_EXISTS,
                        };
                    }
                }
            }
            const update_profile = yield model.updateProfile({ username, first_name, last_name, gender, photo, status }, { id: Number(id) });
            if (update_profile) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: req.body,
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
    //create city
    createCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Model.commonModel();
            const data = yield model.getAllCity(req.body.country_id, 1, 0, undefined, req.body.name);
            if (data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: data[0].id
                };
            }
            const res = yield model.insertCity(req.body);
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: res[0].id
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR
                };
            }
        });
    }
}
exports.default = AdministrationService;
