import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import {
  IGetAPIAirlinesParams,
  IInsertAPIAirlinesCommission,
  IUpdateAPIAirlinesCommission,
} from '../../utils/interfaces/common/commissionAirlinesRoutesInterface';
import Schema from '../../utils/miscellaneous/schema';

export class AirlineCommissionModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // GET Flight API
  public async getFlightAPI(id?: number, name?: string) {
    return await this.db('flight_api')
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
  }

  // Update Flight API
  public async updateFlightAPI(id: number, status: boolean) {
    return await this.db('flight_api')
      .withSchema(this.DBO_SCHEMA)
      .update({ status })
      .where({ id });
  }

  // Get API Airlines Commission
  public async getAPIAirlinesCommission({
    airline,
    api_id,
    status,
    api_status,
  }: IGetAPIAirlinesParams) {
    return await this.db('api_airlines_commission AS aac')
      .withSchema(this.DBO_SCHEMA)
      .select(
        'aac.id',
        'aac.com_domestic',
        'aac.com_international',
        'aac.com_type',
        'aac.com_mode',
        'aac.status',
        'fa.id AS api_id',
        'fa.name AS api_name'
      )
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
  }

  // Insert API Airlines Commission
  public async insertAPIAirlinesCommission(
    payload: IInsertAPIAirlinesCommission | IInsertAPIAirlinesCommission[]
  ) {
    return await this.db('api_airlines_commission')
      .withSchema(this.DBO_SCHEMA)
      .insert(payload);
  }

  // Update API Airlines Commission
  public async updateAPIAirlinesCommission(
    id: number,
    payload: IUpdateAPIAirlinesCommission
  ) {
    await this.db('api_airlines_commission')
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where({ id });
  }
}
