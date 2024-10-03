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
    // GET Flight API
    getFlightAPI(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('flight_api')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where((qb) => {
                if (id) {
                    qb.andWhere('id', id);
                }
                if (name) {
                    qb.andWhere('name', name);
                }
            });
        });
    }
    // Update Flight API
    updateFlightAPI(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('flight_api')
                .withSchema(this.DBO_SCHEMA)
                .update({ status })
                .where({ id });
        });
    }
    // Get API Airlines Commission
    getAPIAirlinesCommission(_a) {
        return __awaiter(this, arguments, void 0, function* ({ airline, api_id, status, api_status, }) {
            return yield this.db('api_airlines_commission AS aac')
                .withSchema(this.DBO_SCHEMA)
                .select('aac.id', 'aac.com_domestic', 'aac.com_international', 'aac.com_type', 'aac.com_mode', 'aac.status', 'fa.id AS api_id', 'fa.name AS api_name')
                .leftJoin('flight_api AS fa', 'aac.api_id', 'fa.id')
                .where((qb) => {
                if (api_status) {
                    qb.andWhere('fa.status', api_status);
                }
                if (api_id) {
                    qb.andWhere('aac.api_id', api_id);
                }
                if (api_id) {
                    qb.andWhere('aac.airline', airline);
                }
                if (api_id) {
                    qb.andWhere('aac.status', status);
                }
            });
        });
    }
    // Insert API Airlines Commission
    insertAPIAirlinesCommission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('api_airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    // Update API Airlines Commission
    updateAPIAirlinesCommission(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db('api_airlines_commission')
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
}
exports.AirlineCommissionModel = AirlineCommissionModel;
