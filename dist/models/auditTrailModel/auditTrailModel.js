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
exports.AuditTrailModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class AuditTrailModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //create btob audit
    createBtoBAudit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("btob_audit_trail").insert(payload);
        });
    }
    //get btob audit
    getBtoBAudit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = yield this.db("btob_audit_trail as at")
                .select("at.id", "bu.name as created_by", "at.type", "at.details", "at.created_at")
                .leftJoin("btob_user as bu", "bu.id", "at.created_by")
                .where("at.agency_id", payload.agency_id)
                .andWhere((qb) => {
                if (payload.type) {
                    qb.andWhere("at.type", payload.type);
                }
                if (payload.from_date && payload.to_date) {
                    qb.andWhereBetween("at.created_at", [
                        payload.from_date,
                        payload.to_date,
                    ]);
                }
            })
                .limit(payload.limit || 100)
                .offset(payload.skip || 0)
                .orderBy("at.id", "desc");
            const total = yield this.db("btob_audit_trail as at")
                .count("at.id as total")
                .leftJoin("btob_user as bu", "bu.id", "at.created_by")
                .where("at.agency_id", payload.agency_id)
                .andWhere((qb) => {
                if (payload.type) {
                    qb.andWhere("at.type", payload.type);
                }
                if (payload.from_date && payload.to_date) {
                    qb.andWhereBetween("at.created_at", [
                        payload.from_date,
                        payload.to_date,
                    ]);
                }
            });
            return {
                data,
                total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total,
            };
        });
    }
}
exports.AuditTrailModel = AuditTrailModel;
