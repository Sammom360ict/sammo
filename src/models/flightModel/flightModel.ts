import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import Schema from '../../utils/miscellaneous/schema';

export class FlightModel extends Schema {
    private db: TDB;
    constructor(db: TDB) {
        super();
        this.db = db;
    }

    // insert flight search
    public async insertFlightSearch(payload: { user_id?: number, ip_address?: string, search_data: string, departure_date_time: string }) {
        return await this.db('flight_search').withSchema(this.DBO_SCHEMA).insert(payload, 'id');
    }

    //get flight search
    public async getFlightSearch(params: { user_id?: number, ip_address?: string, search_data?: string, present_date_time?: string, from_date?: string, to_date?: Date, limit?: number, skip?: number }, is_total: boolean = false) {
        const data = await this.db('flight_search')
            .withSchema(this.DBO_SCHEMA)
            .select('*')
            .where((qb) => {
                if (params.search_data) {
                    qb.andWhere('search_data', params.search_data)
                }
                if (params.user_id || params.ip_address) {
                    qb.andWhere((qbc) => {
                        if (params.user_id) {
                            qbc.where('user_id', params.user_id)
                        } else {
                            qbc.where('ip_address', params.ip_address)
                        }
                    })
                }
                if (params.present_date_time) {
                    qb.andWhere('departure_date_time', '>', params.present_date_time)
                }
                if (params.from_date && params.to_date) {
                    qb.andWhereBetween('search_at', [params.from_date, params.to_date]);
                }
            })
            .orderBy('search_at', 'desc')
            .limit(params.limit || 10)
            .offset(params.skip || 0);

        let total: any[] = [];

        if (is_total) {
            total = await this.db('flight_search')
                .withSchema(this.DBO_SCHEMA)
                .count('* as total')
                .where((qb) => {
                    if (params.search_data) {
                        qb.andWhere('search_data', params.search_data)
                    }
                    if (params.user_id || params.ip_address) {
                        qb.andWhere((qbc) => {
                            if (params.user_id) {
                                qbc.where('user_id', params.user_id)
                            } else {
                                qbc.where('ip_address', params.ip_address)
                            }
                        })
                    }
                    if (params.present_date_time) {
                        qb.andWhere('departure_date_time', '>', params.present_date_time)
                    }
                    if (params.from_date && params.to_date) {
                        qb.andWhereBetween('search_at', [params.from_date, params.to_date]);
                    }
                })
        }

        return{ data, total: total[0]?.total}
    }

    //update flight search time
    public async updateFlightSearchTime(id: number) {
        return await this.db("flight_search")
            .withSchema(this.DBO_SCHEMA)
            .update('search_at', new Date())
            .where({ id });
    }
}
