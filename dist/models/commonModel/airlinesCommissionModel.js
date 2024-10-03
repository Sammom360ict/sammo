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
exports.AirlineCommissionModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class AirlineCommissionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert airlines commission
    insert(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    // get airlines commission
    get(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, is_total = false) {
            var _a;
            const data = yield this.db('dbo.airlines_commission AS ac')
                .select('ac.airline_code', 'oa.name as airline_name', 'oa.logo as airline_logo', 'ac.capping', 'ac.soto_commission', 'ac.from_dac_commission', 'ac.to_dac_commission', 'ac.soto_allowed', 'ac.last_updated', 'ac.domestic_commission', 'a.username AS updated_by')
                .leftJoin('dbo.airlines AS oa', 'ac.airline_code', 'oa.code')
                .leftJoin('admin.user_admin AS a', 'ac.updated_by', 'a.id')
                .where((qb) => {
                if (query.code) {
                    qb.andWhere('ac.airline_code', 'ilike', `${query.code}`);
                }
                if (query.name) {
                    qb.orWhere('oa.name', 'ilike', `%${query.name}%`);
                }
                if (query.last_update) {
                    qb.andWhere('ac.last_updated', query.last_update);
                }
                if (query.check_code) {
                    qb.where('ac.airline_code', query.check_code);
                }
            })
                .limit(query.limit ? Number(query.limit) : 100)
                .offset(query.skip ? Number(query.skip) : 0)
                .orderBy('ac.last_updated', 'desc');
            let total = [];
            if (is_total) {
                total = yield this.db('dbo.airlines_commission AS ac')
                    .count('ac.airline_code AS total')
                    .leftJoin('dbo.airlines AS oa', 'ac.airline_code', 'oa.code')
                    .leftJoin('admin.user_admin AS a', 'ac.updated_by', 'a.id')
                    .where((qb) => {
                    if (query.code) {
                        qb.andWhere((qbc) => {
                            qbc.andWhere('ac.airline_code', 'ilike', `${query.code}`);
                            qbc.orWhere('oa.name', 'ilike', `%${query.code}%`);
                        });
                    }
                    if (query.name) {
                        qb.orWhere('oa.name', 'ilike', `%${query.name}%`);
                    }
                    if (query.last_update) {
                        qb.andWhere('ac.last_updated', query.last_update);
                    }
                });
            }
            return {
                data,
                total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total,
            };
        });
    }
    // get single airline commission
    getSingle(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ airline_code: code });
        });
    }
    // update
    update(payload, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where('airline_code', code);
        });
    }
    //delete
    delete(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .delete()
                .where('airline_code', code);
        });
    }
    //get all airline with capping
    getAllAirline() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .select('airline_code as Code')
                .where('capping', 1);
            return data;
        });
    }
}
exports.AirlineCommissionModel = AirlineCommissionModel;
