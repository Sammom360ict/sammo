import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import { ICreateAgencyPayload, ICreateAgencyUserPayload, IGetAgentTransactionsParams, IInsertAgencyDepositPayload, IInsertTravelerPayload } from '../../utils/interfaces/agent/agency.interface';
import Schema from '../../utils/miscellaneous/schema';

export class AgencyModel extends Schema {
    private db: TDB;
    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //create agency
    public async createAgency(payload: ICreateAgencyPayload) {
        return await this.db("agency_info")
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id');
    }

    //create agency user
    public async createAgencyUser(payload: ICreateAgencyUserPayload) {
        return await this.db("btob_user")
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id');
    }

    //get agency
    public async getAgency(payload: { name?: string, status?: string, limit?: number, skip?: number, ref_id?: number }) {
        const data = await this.db("agency_info")
            .withSchema(this.BTOB_SCHEMA)
            .select("id", "agency_logo", "agency_name", "email", "phone", "status", "created_at")
            .where((qb) => {
                if (payload.name) {
                    qb.andWhere("agency_name", payload.name)
                }
                if (payload.status !== undefined) {
                    qb.andWhere("status", payload.status)
                }
                if (payload.ref_id) {
                    qb.andWhere("ref_id", payload.ref_id)
                }
            })
            .orderBy("id", 'desc')
            .limit(payload.limit || 100)
            .offset(payload.skip || 0);

        let total: any[] = [];
        total = await this.db("agency_info")
            .withSchema(this.BTOB_SCHEMA)
            .count("* as total")
            .where((qb) => {
                if (payload.name) {
                    qb.andWhere("agency_name", payload.name)
                }
                if (payload.status !== undefined) {
                    qb.andWhere("status", payload.status)
                }
                if (payload.ref_id) {
                    qb.andWhere("ref_id", payload.ref_id)
                }
            })


        return { data, total: total[0]?.total }
    }

    //get single agency
    public async getSingleAgency(id: number, ref_id?: number) {
        return await this.db("agency_info")
            .withSchema(this.BTOB_SCHEMA)
            .select("*")
            .where({ id })
            .andWhere((qb) => {
                if (ref_id) {
                    qb.andWhere("ref_id", ref_id);
                }
            })
    }

    //get user
    public async getUser(payload: { agency_id: number, limit?: number, skip?: number }) {
        return await this.db("btob_user")
            .withSchema(this.BTOB_SCHEMA)
            .select("id", "name", "email", "mobile_number", "photo", "status")
            .where("agency_id", payload.agency_id)
            .orderBy("id", 'desc')
            .limit(payload.limit || 100)
            .offset(payload.skip || 0)
    }

    //update agency
    public async updateAgency(payload: any, id: number) {
        return await this.db("agency_info")
            .withSchema(this.BTOB_SCHEMA)
            .update(payload)
            .where({ id })
    }
    //update agency user
    public async updateAgencyUser(payload: { status?: boolean, hashed_password?: string, name?: string, mobile_number?: string, photo?: string }, id: number) {
        return await this.db("btob_user")
            .withSchema(this.BTOB_SCHEMA)
            .update(payload)
            .where({ id })
    }
    //get single user
    public async getSingleUser(payload: { email?: string, id?: number }) {
        return await this.db("btob_user")
            .withSchema(this.BTOB_SCHEMA)
            .select("*")
            .where((qb) => {
                if (payload.email) {
                    qb.where("email", payload.email)
                }
                if (payload.id) {
                    qb.where("id", payload.id)
                }
            })
    }

    //insert agency deposit
    public async insertAgencyDeposit(payload: IInsertAgencyDepositPayload) {
        return await this.db("agency_deposits")
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id')
    }

    //get total deposit
    public async getTotalDeposit(
        agency_id: number
    ) {
        const data = await this.db('b2b.agency_deposits')
            .select(
                this.db.raw(
                    `
        (
          SELECT 
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) - 
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) 
          AS balance 
          FROM b2b.agency_deposits 
          WHERE agency_id = ?
        ) AS balance
        `, [agency_id]
                )
            )
            .first();
        if (data) {
            return Number(data.balance);
        } else {
            return 0;
        }

    }

    //get agency transactions
    public async getAgencyTransactions(
        params: IGetAgentTransactionsParams,
        need_total: boolean = true
    ) {
        const data = await this.db("b2b.agency_deposits as ad")
            .select(
                "ad.id",
                "ad.type",
                "ad.amount",
                "ad.date",
                "ad.details",
                "a.username as deposited_by",
                this.db.raw(
                    `(SELECT SUM(CASE WHEN acl.type = ? THEN acl.amount ELSE 0 END) - SUM(CASE WHEN acl.type = ? THEN acl.amount ELSE 0 END) as balance FROM b2b.agency_deposits AS acl where acl.agency_id = ad.agency_id and acl.id <= ad.id and acl.agency_id = ? ) as last_balance`,
                    ["credit", "debit", params.agency_id]
                )
            )
            .leftJoin("admin.user_admin AS a", "ad.created_by", "a.id")
            .where((qb) => {
                qb.andWhere("ad.agency_id", params.agency_id);
                if (params.start_date && params.end_date) {
                    qb.andWhereBetween("ad.date", [
                        params.start_date,
                        params.end_date,
                    ]);
                }
                if (params.type) {
                    qb.andWhere('ad.type', params.type)
                }
                if (params.search) {
                    qb.andWhere('ad.details', 'like', `%${params.search}%`)
                }
            })
            .orderBy("ad.id", "desc")
            .limit(params.limit ? params.limit : 100)
            .offset(params.skip ? params.skip : 0);

        let total: any[] = [];

        if (need_total) {
            total = await this.db("b2b.agency_deposits as ad")
                .count("* AS total")
                .where((qb) => {
                    qb.andWhere("ad.agency_id", params.agency_id);
                    if (params.start_date && params.end_date) {
                        qb.andWhereBetween("ad.date", [
                            params.start_date,
                            params.end_date,
                        ]);
                    }
                    if (params.type) {
                        qb.andWhere('ad.type', params.type)
                    }
                    if (params.search) {
                        qb.andWhere('ad.details', 'like', `%${params.search}%`)
                    }
                })
        }

        return { data, total: total[0]?.total };
    }


    //insert b2b traveler
    public async insertTraveler(payload: IInsertTravelerPayload) {
        return await this.db("b2b.travelers")
            .insert(payload, 'id')
    }

    // get all travelers
    public async getAllTravelers(payload: any) {
        const { limit, skip, agency_id, name, status } = payload;

        const dtbs = this.db('b2b.travelers');
        if (limit && skip) {
            dtbs.limit(parseInt(limit as string));
            dtbs.offset(parseInt(skip as string));
        }

        const data = await dtbs
            .select(
                'travelers.id',
                'reference',
                'first_name as mid_name',
                'sur_name',
                this.db.raw(`
                CASE 
                    WHEN gender = 'M' THEN 'M' 
                    WHEN gender = 'F' THEN 'F' 
                    ELSE gender 
                END as gender
                `),
                'phone',
                'date_of_birth',
                'email',
                'type',
                'passport_number',
                'passport_expire_date',
                'country_id',
                'city',
                'frequent_flyer_airline',
                'frequent_flyer_number',
                'con.name as country'
            )
            .leftJoin('dbo.country as con', 'con.id', 'travelers.country_id')
            .where({ agency_id })
            .andWhere(function () {
                if (name) {
                    this.andWhereRaw(
                        "LOWER(CONCAT(first_name, ' ', sur_name)) LIKE LOWER(?)",
                        [`%${name.toLowerCase()}%`]
                    );
                }
                if (status !== undefined) {
                    this.andWhere('status', status);
                }
            });

        const total = await this.db('b2b.travelers')
            .count('id as total')
            .where({ agency_id })
            .andWhere(function () {
                if (name) {
                    this.andWhereRaw(
                        "LOWER(CONCAT(first_name, ' ', sur_name)) LIKE LOWER(?)",
                        [`%${name.toLowerCase()}%`]
                    );
                }
                if (status !== undefined) {
                    this.andWhere('status', status);
                }
            });

        return { data, total: parseInt(total[0].total as string) };
    }

    //   update travelers
    public async updateTravelers(agency_id: number, id: number, payload: any) {
        return await this.db('travelers')
            .withSchema(this.BTOB_SCHEMA)
            .update(payload)
            .where({
                agency_id,
            })
            .andWhere({ id });
    }

    // get single travelers
    public async getSingleTravelers(agency_id: number, id: number) {
        return await this.db('b2b.travelers')
            .select(
                'travelers.id',
                'reference',
                'first_name as mid_name',
                'sur_name',
                this.db.raw(`
          CASE 
            WHEN gender = 'M' THEN 'M' 
            WHEN gender = 'F' THEN 'F' 
            ELSE gender 
          END as gender
        `),
                'phone',
                'date_of_birth',
                'email',
                'type',
                'passport_number',
                'passport_expire_date',
                'country_id',
                'city',
                'frequent_flyer_airline',
                'frequent_flyer_number',
                'con.name as country'
            )
            .leftJoin('dbo.country as con', 'con.id', 'travelers.country_id')
            .where({ agency_id })
            .andWhere('travelers.id', id);
    }

    //delete travelers
    public async deleteTraveler(agency_id: number, id: number) {
        return await this.db('b2b.travelers')
            .delete()
            .where({ agency_id })
            .andWhere({ id });
    }
}