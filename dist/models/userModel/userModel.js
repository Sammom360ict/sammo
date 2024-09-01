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
class UserModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //register
    registerUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload, "id");
        });
    }
    //profile
    getProfileDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.BTOC_SCHEMA)
                .select("*")
                .where((qb) => {
                if (params.id) {
                    qb.where("id", params.id);
                }
                if (params.email) {
                    qb.orWhere("email", params.email);
                }
                if (params.phone_number) {
                    qb.orWhere("phone_number", params.phone_number);
                }
                if (params.username) {
                    qb.orWhere("username", params.username);
                }
            });
        });
    }
    //update
    updateProfile(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.BTOC_SCHEMA)
                .update(payload)
                .where((qb) => {
                if (where.id) {
                    qb.where("id", where.id);
                }
            });
        });
    }
    //list
    getAllUser(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, is_total = false) {
            var _a;
            const data = yield this.db("users")
                .withSchema(this.BTOC_SCHEMA)
                .select("id", "username", "first_name", "last_name", "email", "photo", "status", "phone_number", "created_at")
                .where((qb) => {
                if (query.status !== undefined) {
                    qb.where("status", query.status);
                }
                if (query.filter) {
                    qb.andWhere((qbc) => {
                        qbc.whereILike("username", `%${query.filter}%`);
                        qbc.orWhereILike("email", `%${query.filter}%`);
                        qbc.orWhereILike("phone_number", `%${query.filter}%`);
                        qbc.orWhereRaw("LOWER(first_name || ' ' || last_name) LIKE LOWER(?)", [
                            `%${query.filter ? query.filter.toLocaleLowerCase() : undefined}%`,
                        ]);
                    });
                }
            })
                .orderBy("id", "desc")
                .limit(query.limit || 100)
                .offset(query.skip || 0);
            let total = [];
            if (is_total) {
                total = yield this.db("users")
                    .withSchema(this.BTOC_SCHEMA)
                    .count("id as total")
                    .where((qb) => {
                    if (query.status !== undefined) {
                        qb.where("status", query.status);
                    }
                    if (query.filter) {
                        qb.andWhere((qbc) => {
                            qbc.whereILike("username", `%${query.filter}%`);
                            qbc.orWhereILike("email", `%${query.filter}%`);
                            qbc.orWhereILike("phone_number", `%${query.filter}%`);
                            qbc.orWhereRaw("LOWER(first_name || ' ' || last_name) LIKE LOWER(?)", [
                                `%${query.filter ? query.filter.toLocaleLowerCase() : undefined}%`,
                            ]);
                        });
                    }
                });
            }
            return {
                data: data,
                total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total,
            };
        });
    }
}
exports.default = UserModel;
