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
exports.FlightModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class FlightModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert flight search
    insertFlightSearch(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('flight_search').withSchema(this.DBO_SCHEMA).insert(payload, 'id');
        });
    }
    //get flight search
    getFlightSearch(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, is_total = false) {
            var _a;
            const data = yield this.db('flight_search')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where((qb) => {
                if (params.search_data) {
                    qb.andWhere('search_data', params.search_data);
                }
                if (params.user_id || params.ip_address) {
                    qb.andWhere((qbc) => {
                        if (params.user_id) {
                            qbc.where('user_id', params.user_id);
                        }
                        else {
                            qbc.where('ip_address', params.ip_address);
                        }
                    });
                }
                if (params.present_date_time) {
                    qb.andWhere('departure_date_time', '>', params.present_date_time);
                }
                if (params.from_date && params.to_date) {
                    qb.andWhereBetween('search_at', [params.from_date, params.to_date]);
                }
            })
                .orderBy('search_at', 'desc')
                .limit(params.limit || 10)
                .offset(params.skip || 0);
            let total = [];
            if (is_total) {
                total = yield this.db('flight_search')
                    .withSchema(this.DBO_SCHEMA)
                    .count('* as total')
                    .where((qb) => {
                    if (params.search_data) {
                        qb.andWhere('search_data', params.search_data);
                    }
                    if (params.user_id || params.ip_address) {
                        qb.andWhere((qbc) => {
                            if (params.user_id) {
                                qbc.where('user_id', params.user_id);
                            }
                            else {
                                qbc.where('ip_address', params.ip_address);
                            }
                        });
                    }
                    if (params.present_date_time) {
                        qb.andWhere('departure_date_time', '>', params.present_date_time);
                    }
                    if (params.from_date && params.to_date) {
                        qb.andWhereBetween('search_at', [params.from_date, params.to_date]);
                    }
                });
            }
            return { data, total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total };
        });
    }
    //update flight search time
    updateFlightSearchTime(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("flight_search")
                .withSchema(this.DBO_SCHEMA)
                .update('search_at', new Date())
                .where({ id });
        });
    }
}
exports.FlightModel = FlightModel;
