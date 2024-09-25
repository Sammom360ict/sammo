import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import {
  IGetRoutesCommissionParams,
  IUpdateRoutesCommissionPayload,
} from '../../utils/interfaces/common/commissionAirlinesRoutesInterface';
import Schema from '../../utils/miscellaneous/schema';

export class AirlineCommissionModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // Insert routes commission
  public async insertRoutesCommission(payload: IUpdateRoutesCommissionPayload) {
    return await this.db('routes_commission')
      .withSchema(this.DBO_SCHEMA)
      .insert(payload);
  }

  // Get routes commission
  public async getRoutesCommission({
    arrival,
    departure,
    one_way,
    round_trip,
    status,
  }: IGetRoutesCommissionParams) {
    return await this.db('routes_commission')
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
  }
}
