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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class AdministrationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //---Role---
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('roles')
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, 'id');
        });
    }
    roleList(limit_1, skip_1) {
        return __awaiter(this, arguments, void 0, function* (limit, skip, total = false) {
            var _a;
            const data = yield this.db('roles as rl')
                .withSchema(this.ADMIN_SCHEMA)
                .select('rl.id as role_id', 'rl.name as role_name', 'ua.username as created_by', 'rl.create_date')
                .join('user_admin as ua', 'ua.id', 'rl.created_by')
                .limit(limit ? limit : 100)
                .offset(skip ? skip : 0)
                .orderBy('rl.id', 'asc');
            let count = [];
            if (total) {
                count = yield this.db('roles as rl')
                    .withSchema(this.ADMIN_SCHEMA)
                    .count('rl.id as total')
                    .join('user_admin as ua', 'ua.id', 'rl.created_by');
            }
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    getSingleRole(id, name, permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('roles as rol')
                .withSchema(this.ADMIN_SCHEMA)
                .select('per.id', 'per.name as permissions')
                .leftJoin('role_permissions as rp', 'rp.role_id', 'rol.id')
                .leftJoin('permissions as per', 'rp.permission_id', 'per.id')
                .where((qb) => {
                if (id) {
                    qb.where('rol.id', id);
                }
                if (name) {
                    qb.where('rol.name', name);
                }
                if (permission_id) {
                    qb.andWhere('per.id', permission_id);
                }
            });
        });
    }
    //---Permission---
    createPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('permissions')
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, 'id');
        });
    }
    permissionsList(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, total = false) {
            var _a;
            const data = yield this.db('permissions as per')
                .withSchema(this.ADMIN_SCHEMA)
                .select('per.id as permission_id', 'per.name as permission_name', 'ua.username as created_by', 'per.create_date')
                .join('user_admin as ua', 'ua.id', 'per.created_by')
                .limit(params.limit ? params.limit : 100)
                .offset(params.skip ? params.skip : 0)
                .orderBy('per.id', 'asc')
                .where((qb) => {
                if (params.name) {
                    qb.where('per.name', params.name);
                }
            });
            let count = [];
            if (total) {
                count = yield this.db('permissions')
                    .withSchema(this.ADMIN_SCHEMA)
                    .count('id as total')
                    .where((qb) => {
                    if (params.name) {
                        qb.where('name', params.name);
                    }
                });
            }
            return { data, total: (_a = count[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    //---Role Permission---
    createRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('role_permissions')
                .withSchema(this.ADMIN_SCHEMA)
                .insert(payload, 'role_id');
        });
    }
    deleteRolePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('role_permissions')
                .withSchema(this.ADMIN_SCHEMA)
                .delete()
                .where('role_id', payload.role_id)
                .andWhere('permission_id', payload.permission_id);
        });
    }
    getRolePermissions(role_id, permission_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('role_permissions')
                .withSchema(this.ADMIN_SCHEMA)
                .where({ role_id })
                .andWhere({ permission_id });
        });
    }
}
exports.default = AdministrationModel;
