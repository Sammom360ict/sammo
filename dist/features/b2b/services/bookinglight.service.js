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
const abstract_service_1 = __importDefault(require("../../../abstract/abstract.service"));
const redis_1 = require("../../../app/redis");
const lib_1 = __importDefault(require("../../../utils/lib/lib"));
const requestFomatter_1 = __importDefault(require("../../../utils/lib/requestFomatter"));
const sabreApiEndpoints_1 = require("../../../utils/miscellaneous/sabreApiEndpoints");
const responseFormatter_1 = __importDefault(require("../../../utils/lib/responseFormatter"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
const sabreRequest_1 = __importDefault(require("../../../utils/lib/sabreRequest"));
const uuid_1 = require("uuid");
class BookingFlightService extends abstract_service_1.default {
    constructor() {
        super();
        this.ReqFormatter = new requestFomatter_1.default();
        this.ResFormatter = new responseFormatter_1.default();
        this.request = new sabreRequest_1.default();
    }
    // search flight service
    flightSearch(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const uid_val = (0, uuid_1.v4)();
            const search_id = "btob" + uid_val;
            const body = req.body;
            const retrievedData = yield (0, redis_1.getRedis)(search_id);
            const retrievedReqBody = retrievedData === null || retrievedData === void 0 ? void 0 : retrievedData.reqBody;
            const hasSameValues = lib_1.default.compareObj(body, retrievedReqBody);
            if (retrievedReqBody && hasSameValues) {
                const retrieveResponse = retrievedData === null || retrievedData === void 0 ? void 0 : retrievedData.response;
                if (query.carrier_operating) {
                    const filter_data = yield this.flightFilter(req);
                    return filter_data;
                }
                return {
                    success: true,
                    search_id,
                    message: this.ResMsg.HTTP_OK,
                    data: retrieveResponse,
                    count: retrievedData.count,
                    code: this.StatusCode.HTTP_OK,
                };
            }
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const flightRequestBody = yield this.ReqFormatter.flightSearch(body);
                if (!flightRequestBody) {
                    return {
                        success: false,
                        message: "Capping is not available for any flight",
                        code: this.StatusCode.HTTP_NOT_FOUND,
                    };
                }
                const commonModel = this.Model.commonModel(trx);
                const response = yield this.request.postRequest(sabreApiEndpoints_1.FLIGHT_SEARCH_ENDPOINT, flightRequestBody);
                console.log({ response });
                // const flight_commission = await commonModel.getEnv(FLIGHT_COMMISSION);
                const [formattedResponse, count] = yield this.ResFormatter.flightSearch(trx, response.groupedItineraryResponse, body
                // Number(flight_commission)
                );
                const dataForStore = {
                    reqBody: body,
                    response: formattedResponse,
                    count,
                };
                yield (0, redis_1.setRedis)(search_id, dataForStore);
                if (query.carrier_operating) {
                    const filter_data = yield this.flightFilter(req);
                    return filter_data;
                }
                const size = Number(query.size || 20);
                const data = Object.assign(Object.assign({}, formattedResponse), { results: formattedResponse.results.slice(0, size) });
                return {
                    success: true,
                    message: this.ResMsg.HTTP_OK,
                    count,
                    search_id,
                    data,
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
    // filter flight service
    flightFilter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = req.query;
            const { search_id } = req.query;
            const retrievedData = yield (0, redis_1.getRedis)(search_id);
            const retrieveResponse = retrievedData === null || retrievedData === void 0 ? void 0 : retrievedData.response;
            if (!retrievedData) {
                return {
                    success: false,
                    message: "Data lost! Search again.",
                    code: this.StatusCode.HTTP_NOT_FOUND,
                };
            }
            const sortedResponse = this.ResFormatter.filterFlightSearch(retrieveResponse, query);
            return Object.assign(Object.assign({ success: true, search_id, message: this.ResMsg.HTTP_OK }, sortedResponse), { code: this.StatusCode.HTTP_OK });
        });
    }
    // revalidate flight service
    revalidate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const search_id = req.query.search_id;
            const flightId = req.params.flight_id;
            // const commonModel = this.Model.commonModel();
            // const flight_commission = await commonModel.getEnv(FLIGHT_COMMISSION);
            const data = yield this.subRevalidate(search_id, flightId
            // Number(flight_commission)
            );
            if (data) {
                return {
                    success: true,
                    message: "Ticket has been revalidate successfully!",
                    data,
                    code: this.StatusCode.HTTP_OK,
                };
            }
            return {
                success: true,
                message: this.ResMsg.HTTP_NOT_FOUND,
                code: this.StatusCode.HTTP_NOT_FOUND,
            };
        });
    }
    // revalidate flight sub service
    subRevalidate(search_id, flightId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const retrievedData = yield (0, redis_1.getRedis)(search_id);
            console.log({ retrievedData });
            if (!retrievedData) {
                return null;
            }
            const retrieveResponse = retrievedData.response;
            console.log({ retrieveResponse });
            const foundItem = retrieveResponse.results.find((item) => item.flight_id === flightId);
            console.log({ foundItem });
            if (!foundItem) {
                return null;
            }
            const formattedReqBody = this.ReqFormatter.revalidateReqBodyFormatter(retrievedData.reqBody, foundItem);
            const response = yield this.request.postRequest(sabreApiEndpoints_1.FLIGHT_REVALIDATE_ENDPOINT, formattedReqBody);
            console.log({ response });
            if (((_a = response.groupedItineraryResponse) === null || _a === void 0 ? void 0 : _a.statistics.itineraryCount) === 0) {
                throw new customError_1.default("Cannot revalidate flight with this flight id", 400);
            }
            const formattedResponse = yield this.ResFormatter.revalidate(response.groupedItineraryResponse, retrievedData.reqBody);
            formattedResponse.ticket_last_date = formattedResponse.ticket_last_date
                ? formattedResponse.ticket_last_date
                : foundItem.ticket_last_date;
            formattedResponse.ticket_last_time = formattedResponse.ticket_last_time
                ? formattedResponse.ticket_last_time
                : foundItem.ticket_last_time;
            return formattedResponse;
        });
    }
    //revalidate flight version 2.0
    flightRevalidateV2(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const body = req.body;
            const formattedReqBody = this.ReqFormatter.newRevalidateReqBodyFormatterV2(body);
            const response = yield this.request.postRequest(sabreApiEndpoints_1.FLIGHT_REVALIDATE_ENDPOINT, formattedReqBody);
            console.log({ response });
            if (((_a = response.groupedItineraryResponse) === null || _a === void 0 ? void 0 : _a.statistics.itineraryCount) === 0) {
                throw new customError_1.default("Error during Processing", 400);
            }
            const data = yield this.ResFormatter.revalidate(response.groupedItineraryResponse, body);
            if (data) {
                return {
                    success: true,
                    message: "Ticket has been revalidate successfully!",
                    data,
                    code: this.StatusCode.HTTP_OK,
                };
            }
            return {
                success: true,
                message: this.ResMsg.HTTP_NOT_FOUND,
                code: this.StatusCode.HTTP_NOT_FOUND,
            };
        });
    }
}
exports.default = BookingFlightService;
