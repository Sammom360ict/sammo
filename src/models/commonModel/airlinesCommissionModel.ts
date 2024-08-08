import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import {
  IGetAirlinesCommissionQuery,
  IInsertAirlinesCommissionPayload,
  IUpdateAirlinesCommissionPayload,
} from '../../utils/interfaces/common/airlinesCommissionModel.interface';
import Schema from '../../utils/miscellaneous/schema';

export class AirlineCommissionModel extends Schema {
  private db: TDB;
  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // insert airlines commission
  public async insert(payload: IInsertAirlinesCommissionPayload) {
    return await this.db('airlines_commission')
      .withSchema(this.DBO_SCHEMA)
      .insert(payload);
  }

  // get airlines commission
  public async get(
    query: IGetAirlinesCommissionQuery,
    is_total: boolean = false
  ) {
    const data = await this.db('dbo.airlines_commission AS ac')
      .select(
        'ac.airline_code',
        'oa.name as airline_name',
        'oa.logo as airline_logo',
        'ac.capping',
        'ac.soto_commission',
        'ac.from_dac_commission',
        'ac.to_dac_commission',
        'ac.soto_allowed',
        'ac.last_updated',
        'ac.domestic_commission',
        'a.username AS updated_by'
      )
      .leftJoin('dbo.airlines AS oa', 'ac.airline_code', 'oa.code')
      .leftJoin('admin.user_admin AS a', 'ac.updated_by', 'a.id')
      .where((qb) => {
        if (query.code) {
          qb.andWhere('ac.airline_code', 'ilike', `${query.code}`)
        }
        if (query.name) {
          qb.orWhere('oa.name', 'ilike', `%${query.name}%`)
        }
        if (query.last_update) {
          qb.andWhere('ac.last_updated', query.last_update);
        }
        if (query.check_code) {
          qb.where('ac.airline_code', query.check_code);
        }
      })
      .limit(query.limit ? Number(query.limit) : 100)
      .offset(query.skip ? Number(query.skip) : 0)
      .orderBy('ac.last_updated', 'desc');

    let total: any[] = [];

    if (is_total) {
      total = await this.db('dbo.airlines_commission AS ac')
        .count('ac.airline_code AS total')
        .leftJoin('dbo.airlines AS oa', 'ac.airline_code', 'oa.code')
        .leftJoin('admin.user_admin AS a', 'ac.updated_by', 'a.id')
        .where((qb) => {
          if (query.code) {
            qb.andWhere((qbc) => {
              qbc.andWhere('ac.airline_code', 'ilike', `${query.code}`)
              qbc.orWhere('oa.name', 'ilike', `%${query.code}%`)
            })
          }
          if (query.name) {
            qb.orWhere('oa.name', 'ilike', `%${query.name}%`)
          }
          if (query.last_update) {
            qb.andWhere('ac.last_updated', query.last_update);
          }
        });
    }

    return {
      data,
      total: total[0]?.total,
    };
  }

  // get single airline commission
  public async getSingle(code: string) {
    return await this.db('airlines_commission')
      .withSchema(this.DBO_SCHEMA)
      .select('*')
      .where({ airline_code: code });
  }

  // update
  public async update(payload: IUpdateAirlinesCommissionPayload, code: string) {
    return await this.db('airlines_commission')
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where('airline_code', code);
  }

  //delete
  public async delete(code: string) {
    return await this.db("airlines_commission")
      .withSchema(this.DBO_SCHEMA)
      .delete()
      .where("airline_code", code);
  }

  //get all airline with capping
  public async getAllAirline(){
    const data = await this.db("airlines_commission")
    .withSchema(this.DBO_SCHEMA)
    .select("airline_code as Code")
    .where("capping",1);
    return data;
  }
}
