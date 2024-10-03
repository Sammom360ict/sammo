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
    // Insert routes commission
    insertRoutesCommission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('routes_commission')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    // Get routes commission
    getRoutesCommission(_a) {
        return __awaiter(this, arguments, void 0, function* ({ arrival, departure, one_way, round_trip, status, }) {
            return yield this.db('routes_commission')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where((qb) => {
                if (arrival) {
                    qb.andWhere({ arrival });
                }
                if (departure) {
                    qb.andWhere({ departure });
                }
                if (one_way) {
                    qb.andWhere({ one_way });
                }
                if (round_trip) {
                    qb.andWhere({ round_trip });
                }
                if (status) {
                    qb.andWhere({ status });
                }
            });
        });
    }
}
exports.AirlineCommissionModel = AirlineCommissionModel;
