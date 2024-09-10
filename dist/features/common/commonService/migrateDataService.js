"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const database_1 = require("../../../app/database");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../../../config/config"));
const axios_1 = __importDefault(require("axios"));
const mime = __importStar(require("mime-types"));
class migrateDataService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // migrate airlines
    migrateAirlines() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const airlines = yield (0, database_1.db)("ota_airline").select("*");
                for (const airline of airlines) {
                    yield trx("airlines").withSchema("dbo").insert({
                        id: airline.id,
                        code: airline.airline_code,
                        name: airline.alternative_business_name,
                    });
                }
                return {
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // migrate airport
    migrateAirport() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const airports = yield (0, database_1.db)("airports")
                    .select("*")
                    .where({ is_deleted: 0 });
                for (const airport of airports) {
                    yield trx("airport").withSchema("dbo").insert({
                        id: airport.id,
                        country_id: airport.country_id,
                        iata_code: airport.iata_code,
                        name: airport.name,
                    });
                }
                return {
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // migrate city
    migrateCity() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const datas = yield (0, database_1.db)("city")
                    .select("*")
                    .whereNotNull("city_country_id");
                for (const data of datas) {
                    yield trx("city").withSchema("dbo").insert({
                        id: data.city_id,
                        country_id: data.city_country_id,
                        code: data.city_code,
                        name: data.name,
                        lat: data.lat,
                        lng: data.lng,
                    });
                }
                return {
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // migrate airline image
    migrateAirlineImage() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const airlines = yield trx("airlines").withSchema("dbo").select("*");
                const s3 = new aws_sdk_1.default.S3({
                    accessKeyId: config_1.default.AWS_S3_ACCESS_KEY, // AWS Access Key
                    secretAccessKey: config_1.default.AWS_S3_SECRET_KEY, // AWS Secret Access Key
                    region: "ap-south-1", // Your AWS bucket region
                });
                for (const data of airlines) {
                    (0, axios_1.default)({
                        method: "get",
                        url: `https://fe-pub.s3.ap-southeast-1.amazonaws.com/airlineimages/128/${data.code}.png`,
                        responseType: "arraybuffer",
                    })
                        .then((res) => {
                        const buffer = Buffer.from(res.data, "binary");
                        const fileBuffer = {
                            Bucket: config_1.default.AWS_S3_BUCKET,
                            Key: `amar-flight-files/airlines/${data.code}.png`,
                            Body: buffer,
                            ContentEncoding: "base64",
                            ContentType: mime.lookup(`${data.code}.png`) || "application/octet-stream",
                            ACL: "public-read",
                        };
                        s3.putObject(fileBuffer, (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Image uploaded");
                            }
                        }).promise();
                    })
                        .catch((err) => {
                        console.log(err);
                    });
                }
                return {
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    updateAirlines() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const airlines = yield trx("airlines").withSchema("dbo").select("*");
                for (const airline of airlines) {
                    yield trx("airlines")
                        .withSchema("dbo")
                        .update({
                        logo: `airlines/${airline.code}.png`,
                    })
                        .where({ id: airline.id });
                }
                return {
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
}
exports.default = migrateDataService;
