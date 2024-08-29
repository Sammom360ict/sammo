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
const constants_1 = require("../../utils/miscellaneous/constants");
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class TravelerModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert traveler model
    insertTraveler(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("traveler")
                .withSchema(this.BTOC_SCHEMA)
                .insert(payload);
        });
    }
    // get traveler model
    getTraveler(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, total = false) {
            var _a;
            const data = yield this.db("traveler as tr")
                .withSchema(this.BTOC_SCHEMA)
                .select("tr.id", "tr.title as reference", "tr.first_name as mid_name", "tr.sur_name as sur_name", "tr.mobile_number as phone", "tr.type", "tr.date_of_birth", "tr.email", "tr.city", "tr.passport_number", "tr.passport_expiry_date as passport_expire_date", "tr.frequent_flyer_number", "tr.frequent_flyer_airline", "con.name as country", "con.id as country_id", "tr.gender", "tr.status")
                .joinRaw("left Join dbo.country as con on con.id = tr.country_id")
                .where((qb) => {
                qb.andWhere("tr.deleted", query.deleted);
                if (query.user_id) {
                    qb.andWhere("tr.user_id", query.user_id);
                }
                if (query.name) {
                    qb.andWhereRaw("LOWER(tr.title || ' ' || tr.first_name || ' ' || tr.sur_name) LIKE LOWER(?)", [`%${query.name.toLocaleLowerCase()}%`]);
                }
                if (query.status !== undefined) {
                    qb.andWhere("tr.status", query.status);
                }
            })
                .limit(query.limit ? Number(query.limit) : constants_1.DATA_LIMIT)
                .offset(query.skip ? Number(query.skip) : 0)
                .orderBy("tr.create_date", "desc");
            let count = [];
            if (total) {
                count = yield this.db("traveler")
                    .withSchema(this.BTOC_SCHEMA)
                    .count("id AS total")
                    .where((qb) => {
                    qb.andWhere("deleted", query.deleted);
                    if (query.user_id) {
                        qb.andWhere("user_id", query.user_id);
                    }
                    if (query.name) {
                        qb.andWhereRaw("LOWER(title || ' ' || first_name || ' ' || sur_name) LIKE LOWER(?)", [`%${query.name.toLocaleLowerCase()}%`]);
                    }
                    if (query.status !== undefined) {
                        qb.andWhere("status", query.status);
                    }
                });
            }
            return {
                data,
                total: parseInt((_a = count[0]) === null || _a === void 0 ? void 0 : _a.total),
            };
        });
    }
    // get single traveler model
    getSingleTraveler(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("traveler AS tr")
                .withSchema(this.BTOC_SCHEMA)
                .select("tr.id", "tr.title as reference", "tr.first_name as mid_name", "tr.sur_name as sur_name", "tr.mobile_number as phone", "tr.date_of_birth", "tr.gender", "tr.email", "tr.type", 
            // 'tr.address',
            "tr.city", "tr.country_id", "con.name as country", "tr.passport_number", "tr.passport_expiry_date as passport_expire_date", "tr.frequent_flyer_number", "tr.frequent_flyer_airline", "tr.create_date")
                .joinRaw("left Join dbo.country as con on con.id = tr.country_id")
                .where((qb) => {
                qb.andWhere("tr.id", query.id);
                qb.andWhere("tr.user_id", query.user_id);
                if (query.deleted !== undefined) {
                    qb.andWhere("tr.deleted", query.deleted);
                }
            });
        });
    }
    // update traveler model
    updateTraveler(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db("traveler")
                .withSchema(this.BTOC_SCHEMA)
                .update(payload)
                .where("id", id);
        });
    }
    // delete traveler model
    deleteTraveler(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db("traveler")
                .withSchema(this.BTOC_SCHEMA)
                .delete()
                .where({ id });
        });
    }
}
exports.default = TravelerModel;
