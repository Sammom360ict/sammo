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
    // create role
    createRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const model = this.Model.administrationModel(trx);
                const { role_name, permissions } = req.body;
                const check_name = yield model.getSingleRole({ name: role_name });
                if (check_name.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: `Role already exists with this name`,
                    };
                }
                const role_res = yield model.createRole({
                    name: role_name,
                    created_by: id,
                });
                const uniquePermission = [];
                for (let i = 0; i < permissions.length; i++) {
                    let found = false;
                    for (let j = 0; j < uniquePermission.length; j++) {
                        if (permissions[i].permission_id == uniquePermission[j].permission_id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        uniquePermission.push(permissions[i]);
                    }
                }
                if (uniquePermission.length) {
                    const permission_body = uniquePermission.map((element) => {
                        return {
                            role_id: role_res[0].id,
                            permission_id: element.permission_id,
                            read: element.read,
                            write: element.write,
                            update: element.update,
                            delete: element.delete,
                            created_by: id,
                        };
                    });
                    yield model.createRolePermission(permission_body);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
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
                data: role_list.data,
            };
        });
    }
    //create permission
    createPermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.administrationModel();
            const check_name = yield model.permissionsList({
                name: req.body.permission_name,
            });
            if (check_name.data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.PERMISSION_NAME_EXIST,
                };
            }
            const create_permission = yield model.createPermission({
                name: req.body.permission_name,
                created_by: id,
            });
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
            const permission_list = yield model.permissionsList({
                limit: Number(limit),
                skip: Number(skip),
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total: permission_list.total,
                data: permission_list.data,
            };
        });
    }
    //get single role permission
    getSingleRolePermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const role_id = req.params.id;
            const model = this.Model.administrationModel();
            const role_permission = yield model.getSingleRole({
                id: parseInt(role_id),
            });
            if (!role_permission.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: role_permission[0],
            };
        });
    }
    //update role permission
    updateRolePermissions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: admin_id } = req.admin;
                const model = this.Model.administrationModel(trx);
                const { id: role_id } = req.params;
                const check_role = yield model.getSingleRole({
                    id: Number(role_id),
                });
                if (!check_role.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const { add_permissions, role_name, status } = req.body;
                if (role_name || status) {
                    const check_name = yield model.getSingleRole({ name: role_name });
                    if (!check_name.length) {
                        yield model.updateRole({ name: role_name, status }, Number(role_id));
                    }
                }
                if (add_permissions) {
                    const { data: getAllPermission } = yield model.permissionsList({});
                    const add_permissionsValidataion = [];
                    for (let i = 0; i < add_permissions.length; i++) {
                        for (let j = 0; j < (getAllPermission === null || getAllPermission === void 0 ? void 0 : getAllPermission.length); j++) {
                            if (add_permissions[i].permission_id ==
                                getAllPermission[j].permission_id) {
                                add_permissionsValidataion.push(add_permissions[i]);
                            }
                        }
                    }
                    // get single role permission
                    const { permissions } = check_role[0];
                    const insertPermissionVal = [];
                    const haveToUpdateVal = [];
                    for (let i = 0; i < add_permissionsValidataion.length; i++) {
                        let found = false;
                        for (let j = 0; j < permissions.length; j++) {
                            if (add_permissionsValidataion[i].permission_id ==
                                permissions[j].permission_id) {
                                found = true;
                                haveToUpdateVal.push(add_permissionsValidataion[i]);
                                break;
                            }
                        }
                        if (!found) {
                            insertPermissionVal.push(add_permissions[i]);
                        }
                    }
                    // insert permission
                    const add_permission_body = insertPermissionVal.map((element) => {
                        return {
                            role_id,
                            permission_id: element.permission_id,
                            read: element.read,
                            write: element.write,
                            update: element.update,
                            delete: element.delete,
                            created_by: admin_id,
                        };
                    });
                    if (add_permission_body.length) {
                        yield model.createRolePermission(add_permission_body);
                    }
                    // update section
                    if (haveToUpdateVal.length) {
                        const update_permission_res = haveToUpdateVal.map((element) => __awaiter(this, void 0, void 0, function* () {
                            yield model.updateRolePermission({
                                read: element.read,
                                update: element.update,
                                write: element.write,
                                delete: element.delete,
                                updated_by: admin_id,
                            }, element.permission_id, parseInt(role_id));
                        }));
                        yield Promise.all(update_permission_res);
                    }
                }
                // if (remove_permissions) {
                //   const remove_permission_res = remove_permissions.map(
                //     async (element: any) => {
                //       await model.deleteRolePermission({
                //         role_id: parseInt(role_id),
                //         permission_id: element.permission_id,
                //       });
                //     }
                //   );
                //   await Promise.all(remove_permission_res);
                // }
                // if (update_permissions) {
                //   const update_permission_res = update_permissions.map(
                //     async (element: {
                //       read: 0 | 1;
                //       write: 0 | 1;
                //       update: 0 | 1;
                //       delete: 0 | 1;
                //       permission_id: number;
                //     }) => {
                //       await model.updateRolePermission(
                //         {
                //           read: element.read,
                //           update: element.update,
                //           write: element.write,
                //           delete: element.delete,
                //           updated_by: admin_id,
                //         },
                //         element.permission_id,
                //         parseInt(role_id)
                //       );
                //     }
                //   );
                //   await Promise.all(update_permission_res);
                // }
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
            const check_admin = yield model.getSingleAdmin({
                email,
            });
            if (check_admin.length) {
                if (check_admin[0].email === email) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.EMAIL_EXISTS,
                    };
                }
            }
            const getLastAdminID = yield model.getLastAdminID();
            rest.email = email;
            rest.phone_number = phone_number;
            rest.created_by = id;
            rest.username = username.split(" ").join("") + getLastAdminID;
            //password hashing
            const hashedPass = yield lib_1.default.hashPass(password);
            //create admin
            const create_admin = yield model.createAdmin(Object.assign({ password_hash: hashedPass }, rest));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
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
                const check_username = yield model.getSingleAdmin({
                    username: req.body.username,
                });
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
                const check_phone = yield model.getSingleAdmin({
                    phone_number: req.body.phone_number,
                });
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
    //create city
    createCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.Model.commonModel();
            const data = yield model.getAllCity(req.body.country_id, 1, 0, undefined, req.body.name);
            if (data.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: data[0].id,
                };
            }
            const res = yield model.insertCity(req.body);
            if (res.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: res[0].id,
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
exports.default = AdministrationService;
