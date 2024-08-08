"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("./lib"));
class FlightUtils {
    constructor() {
        // Get layover time
        this.getLayoverTime = (options) => {
            const layoverTime = options.map((item, index) => {
                var _a;
                let firstArrival = options[index].arrivalDate;
                let secondDeparture = (_a = options[index + 1]) === null || _a === void 0 ? void 0 : _a.departureDateTime;
                let layoverTimeString = '00:00:00';
                if (secondDeparture) {
                    const startDate = new Date(firstArrival);
                    const endDate = new Date(secondDeparture);
                    const layoverTimeInMilliseconds = endDate.getTime() - startDate.getTime();
                    const layoverTime = new Date(layoverTimeInMilliseconds);
                    layoverTimeString = layoverTime.toISOString().substr(11, 8);
                }
                return layoverTimeString;
            });
            return layoverTime;
        };
        // Get layover time
        this.getNewLayoverTime = (options) => {
            const layoverTime = options.map((item, index) => {
                var _a, _b;
                let firstArrival = options[index].arrival.time;
                let secondDeparture = (_b = (_a = options[index + 1]) === null || _a === void 0 ? void 0 : _a.departure) === null || _b === void 0 ? void 0 : _b.time;
                let layoverTimeString = 0;
                if (secondDeparture) {
                    const startDate = new Date(`2020-01-01T${firstArrival}`);
                    let endDate = new Date(`2020-01-01T${secondDeparture}`);
                    if (endDate < startDate) {
                        endDate = new Date(`2020-01-02T${secondDeparture}`);
                        // Calculate the difference in milliseconds
                        const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
                        // Convert the difference minutes
                        layoverTimeString = Math.abs(differenceInMilliseconds / (1000 * 60));
                    }
                    else {
                        const layoverTimeInMilliseconds = endDate.getTime() - startDate.getTime();
                        layoverTimeString = Math.abs(layoverTimeInMilliseconds) / (1000 * 60);
                    }
                }
                return layoverTimeString;
            });
            return layoverTime;
        };
        // convert date time
        this.convertDateTime = (dateStr, timeStr) => {
            const date = dateStr.split('T')[0];
            const time = timeStr.slice(0, 8);
            const dateTime = date + 'T' + time;
            return dateTime;
        };
        // get limit skip flight data
        this.getLimitOffset = (results, page, size) => {
            const NSize = Number(size || 20);
            const NPage = Number(page || 1);
            const offset = (NPage - 1) * NSize;
            const limit = NSize * NPage;
            if (offset < results.length) {
                return results.slice(offset, limit);
            }
            return results;
        };
    }
    // get legs desc
    getLegsDesc(legItems, legDesc, OriginDest) {
        const legsDesc = [];
        for (const leg_item of legItems) {
            const leg_id = leg_item.ref;
            const legs = legDesc.find((legDecs) => legDecs.id === leg_id);
            const options = [];
            const f_op = legs === null || legs === void 0 ? void 0 : legs.options[0].departure_airport;
            const l_op_index = Number(legs === null || legs === void 0 ? void 0 : legs.options.length) - 1;
            const l_op = legs === null || legs === void 0 ? void 0 : legs.options[l_op_index].arrival_airport;
            for (const info of OriginDest) {
                const departInfo = info.OriginLocation.LocationCode;
                const arrivalInfo = info.DestinationLocation.LocationCode;
                const date = info.DepartureDateTime;
                if (f_op == departInfo || l_op == arrivalInfo) {
                    for (const option of legs.options) {
                        const departTime = option.departure_time;
                        const combinedString = `${date.split('T')[0]}T${departTime}`;
                        const departureDateTime = new Date(combinedString);
                        const arrivalDate = new Date(departureDateTime);
                        arrivalDate.setMinutes(arrivalDate.getMinutes() + option.elapsedTime);
                        options.push(Object.assign(Object.assign({}, option), { departureDateTime, arrivalDate }));
                    }
                }
            }
            const layoverTime = this.getLayoverTime(options);
            legs.layoverTime = layoverTime;
            legs['options'] = options;
            legsDesc.push(legs);
        }
        return legsDesc;
    }
    getPassengerLists(passengerInfoList, baggageAllowanceDescs, fareComponentDescs) {
        const passengerLists = [];
        for (const pass_item of passengerInfoList) {
            const item = pass_item.passengerInfo;
            const passengerTotalFare = item.passengerTotalFare;
            const fareSegment = item.fareComponents[0].segments[0].segment;
            const meal_type = lib_1.default.getMeal(fareSegment === null || fareSegment === void 0 ? void 0 : fareSegment.mealCode);
            const cabin_type = lib_1.default.getCabin(fareSegment === null || fareSegment === void 0 ? void 0 : fareSegment.cabinCode);
            const baggageInformation = item.baggageInformation[0];
            const allowance_id = baggageInformation.allowance.ref;
            const baggageAllowance = baggageAllowanceDescs.find((all_item) => all_item.id === allowance_id);
            const fareComponents = fareComponentDescs.find((all_item) => all_item.id === item.fareComponents[0].ref);
            const new_item = Object.assign(Object.assign(Object.assign({ passengerType: item.passengerType, passengerNumber: item.passengerNumber, nonRefundable: item.nonRefundable, id: baggageAllowance === null || baggageAllowance === void 0 ? void 0 : baggageAllowance.id, weight: (baggageAllowance === null || baggageAllowance === void 0 ? void 0 : baggageAllowance.weight) || baggageAllowance.pieceCount, unit: (baggageAllowance === null || baggageAllowance === void 0 ? void 0 : baggageAllowance.unit) || 'pieces' }, fareSegment), passengerTotalFare), { meal_type,
                cabin_type, airlineCode: baggageInformation.airlineCode, provisionType: baggageInformation.provisionType, fareComponents });
            passengerLists.push(new_item);
        }
        return passengerLists;
    }
    // // Get new legs desc
    // public newGetLegsDesc(
    //   legItems: {
    //     ref: number;
    //   }[],
    //   legDesc: ILegDesc[],
    //   OriginDest: OriginDestinationInformation[]
    // ) {
    //   const legsDesc: INewLegDesc[] = [];
    //   for (const leg_item of legItems) {
    //     const leg_id = leg_item.ref;
    //     const legs = legDesc.find((legDecs: ILegDesc) => legDecs.id === leg_id);
    //     if (legs) {
    //       const options: any[] = [];
    //       const f_op = legs.options[0].departure.airport_code;
    //       const l_op_index = Number(legs.options.length) - 1;
    //       const l_op = legs.options[l_op_index].arrival.airport_code;
    //       for (const info of OriginDest) {
    //         const departInfo = info.OriginLocation.LocationCode;
    //         const arrivalInfo = info.DestinationLocation.LocationCode;
    //         const date = info.DepartureDateTime;
    //         if (f_op == departInfo || l_op == arrivalInfo) {
    //           for (const option of legs.options) {
    //             const { departureDateAdjustment, ...rest } = option;
    //             const departureDate = new Date(date);
    //             if (departureDateAdjustment) {
    //               departureDate.setDate(
    //                 departureDate.getDate() + departureDateAdjustment
    //               );
    //             }
    //             const arrivalDate = new Date(departureDate);
    //             if (option.arrival.date_adjustment) {
    //               arrivalDate.setDate(
    //                 arrivalDate.getDate() + option.arrival.date_adjustment
    //               );
    //             }
    //             options.push({
    //               ...rest,
    //               departure: {
    //                 ...option.departure,
    //                 date: departureDate,
    //               },
    //               arrival: {
    //                 ...option.arrival,
    //                 date: arrivalDate,
    //               },
    //             });
    //           }
    //         }
    //       }
    //       const layoverTime = this.getNewLayoverTime(options as any);
    //       legsDesc.push({ ...legs, options, layover_time: layoverTime });
    //     }
    //   }
    //   return legsDesc;
    // }
    newGetLegsDesc(legItems, legDesc, OriginDest) {
        const legsDesc = [];
        for (const [index, leg_item] of legItems.entries()) {
            const leg_id = leg_item.ref;
            const legs = legDesc.find((legDecs) => legDecs.id === leg_id);
            if (legs) {
                const options = [];
                const date = OriginDest[index].DepartureDateTime;
                for (const option of legs.options) {
                    const { departureDateAdjustment } = option, rest = __rest(option, ["departureDateAdjustment"]);
                    const departureDate = new Date(date);
                    if (departureDateAdjustment) {
                        departureDate.setDate(departureDate.getDate() + departureDateAdjustment);
                    }
                    const arrivalDate = new Date(departureDate);
                    if (option.arrival.date_adjustment) {
                        arrivalDate.setDate(arrivalDate.getDate() + option.arrival.date_adjustment);
                    }
                    options.push(Object.assign(Object.assign({}, rest), { departure: Object.assign(Object.assign({}, option.departure), { date: departureDate }), arrival: Object.assign(Object.assign({}, option.arrival), { date: arrivalDate }) }));
                }
                const layoverTime = this.getNewLayoverTime(options);
                legsDesc.push(Object.assign(Object.assign({}, legs), { options, layover_time: layoverTime }));
            }
        }
        return legsDesc;
    }
}
exports.default = FlightUtils;
