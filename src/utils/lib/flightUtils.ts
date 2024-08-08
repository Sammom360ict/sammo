import {
  IFlightOption,
  ILegDesc,
  INewLegDesc,
  IUpdatedSchedules,
  OriginDestinationInformation,
} from '../interfaces/flight/flightSearchInterface';
import CustomError from './customError';
import Lib from './lib';

export default class FlightUtils {
  // Get layover time
  private getLayoverTime = (
    options: { departureDateTime: Date; arrivalDate: Date }[]
  ) => {
    const layoverTime = options.map((item, index) => {
      let firstArrival = options[index].arrivalDate;
      let secondDeparture = options[index + 1]?.departureDateTime;

      let layoverTimeString = '00:00:00';

      if (secondDeparture) {
        const startDate = new Date(firstArrival);
        const endDate = new Date(secondDeparture);

        const layoverTimeInMilliseconds: number =
          endDate.getTime() - startDate.getTime();

        const layoverTime: Date = new Date(layoverTimeInMilliseconds);

        layoverTimeString = layoverTime.toISOString().substr(11, 8);
      }

      return layoverTimeString;
    });
    return layoverTime;
  };

  // Get layover time
  private getNewLayoverTime = (options: any[]) => {
    const layoverTime = options.map((item, index) => {
      let firstArrival = options[index].arrival.time;
      let secondDeparture = options[index + 1]?.departure?.time;

      let layoverTimeString = 0;

      if (secondDeparture) {
        const startDate = new Date(`2020-01-01T${firstArrival}`);

        let endDate = new Date(`2020-01-01T${secondDeparture}`);

        if (endDate < startDate) {
          endDate = new Date(`2020-01-02T${secondDeparture}`);
          // Calculate the difference in milliseconds
          const differenceInMilliseconds =
            endDate.getTime() - startDate.getTime();

          // Convert the difference minutes
          layoverTimeString = Math.abs(differenceInMilliseconds / (1000 * 60));
        } else {
          const layoverTimeInMilliseconds =
            endDate.getTime() - startDate.getTime();

          layoverTimeString = Math.abs(layoverTimeInMilliseconds) / (1000 * 60);
        }
      }

      return layoverTimeString;
    });
    return layoverTime;
  };

  // convert date time
  public convertDateTime = (dateStr: string, timeStr: string) => {
    const date = dateStr.split('T')[0];

    const time = timeStr.slice(0, 8);

    const dateTime = date + 'T' + time;

    return dateTime;
  };

  // get legs desc
  public getLegsDesc(legItems: any, legDesc: any, OriginDest: any) {
    const legsDesc: any[] = [];
    for (const leg_item of legItems) {
      const leg_id = leg_item.ref;

      const legs = legDesc.find((legDecs: any) => legDecs.id === leg_id) as {
        layoverTime: string[];
        options: IUpdatedSchedules[];
        id: number;
        elapsedTime: number;
      };

      const options: any[] = [];

      const f_op = legs?.options[0].departure_airport;

      const l_op_index = Number(legs?.options.length) - 1;

      const l_op = legs?.options[l_op_index].arrival_airport;

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

            arrivalDate.setMinutes(
              arrivalDate.getMinutes() + option.elapsedTime
            );

            options.push({ ...option, departureDateTime, arrivalDate });
          }
        }
      }

      const layoverTime = this.getLayoverTime(options as any);

      legs.layoverTime = layoverTime;
      legs['options'] = options;

      legsDesc.push(legs);
    }

    return legsDesc;
  }

  // get limit skip flight data
  public getLimitOffset = (results: any[], page: string, size: string) => {
    const NSize = Number(size || 20);
    const NPage = Number(page || 1);

    const offset = (NPage - 1) * NSize;
    const limit = NSize * NPage;

    if (offset < results.length) {
      return results.slice(offset, limit);
    }
    return results;
  };

  public getPassengerLists(
    passengerInfoList: any,
    baggageAllowanceDescs: any,
    fareComponentDescs: any
  ) {
    const passengerLists: any[] = [];

    for (const pass_item of passengerInfoList) {
      const item = pass_item.passengerInfo;
      const passengerTotalFare = item.passengerTotalFare;

      const fareSegment = item.fareComponents[0].segments[0].segment;

      const meal_type = Lib.getMeal(fareSegment?.mealCode);
      const cabin_type = Lib.getCabin(fareSegment?.cabinCode);

      const baggageInformation = item.baggageInformation[0];
      const allowance_id = baggageInformation.allowance.ref;

      const baggageAllowance = baggageAllowanceDescs.find(
        (all_item: any) => all_item.id === allowance_id
      );

      const fareComponents = fareComponentDescs.find(
        (all_item: any) => all_item.id === item.fareComponents[0].ref
      );

      const new_item = {
        passengerType: item.passengerType,
        passengerNumber: item.passengerNumber,
        nonRefundable: item.nonRefundable,
        id: baggageAllowance?.id,
        weight: baggageAllowance?.weight || baggageAllowance.pieceCount,
        unit: baggageAllowance?.unit || 'pieces',
        ...fareSegment,
        ...passengerTotalFare,
        meal_type,
        cabin_type,
        airlineCode: baggageInformation.airlineCode,
        provisionType: baggageInformation.provisionType,
        fareComponents,
      };

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

  public newGetLegsDesc(
    legItems: {
      ref: number;
    }[],
    legDesc: ILegDesc[],
    OriginDest: OriginDestinationInformation[]
  ) {
    const legsDesc: INewLegDesc[] = [];
    for (const [index, leg_item] of legItems.entries()) {
      const leg_id = leg_item.ref;

      const legs = legDesc.find((legDecs: ILegDesc) => legDecs.id === leg_id);


      if (legs) {
        const options: any[] = [];

        const date = OriginDest[index].DepartureDateTime;


        for (const option of legs.options) {
          const { departureDateAdjustment, ...rest } = option;
          const departureDate = new Date(date);

          if (departureDateAdjustment) {
            departureDate.setDate(
              departureDate.getDate() + departureDateAdjustment
            );
          }

          const arrivalDate = new Date(departureDate);

          if (option.arrival.date_adjustment) {
            arrivalDate.setDate(
              arrivalDate.getDate() + option.arrival.date_adjustment
            );
          }

          options.push({
            ...rest,
            departure: {
              ...option.departure,
              date: departureDate,
            },
            arrival: {
              ...option.arrival,
              date: arrivalDate,
            },
          });
        }



        const layoverTime = this.getNewLayoverTime(options as any);

        legsDesc.push({ ...legs, options, layover_time: layoverTime });
      }
    }
    return legsDesc;
  }
}
