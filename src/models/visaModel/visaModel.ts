import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import { ICreateAppTrackingPayload, ICreateAppTravelerPayload, ICreateB2CApplicationPayload, ICreateB2BApplicationPayload, ICreateVisaPayload, IGetApplicationQuery, IGetVisaQuery, IUpdateVisaPayload, IGetB2BApplicationQuery } from "../../utils/interfaces/visa/visa.interface";
import Schema from "../../utils/miscellaneous/schema";

export class VisaModel extends Schema {
    private db: TDB;
    constructor(db: TDB) {
        super();
        this.db = db;
    }

    //create visa
    public async create(payload: ICreateVisaPayload) {
        return await this.db('visa')
            .withSchema(this.SERVICE_SCHEMA)
            .insert(payload, 'id');
    }

    //get visa
    public async get(query: IGetVisaQuery, is_total: boolean = false) {
        const data = await this.db('services.visa as vi')
            .select('vi.id', 'vi.country_id', 'con.name as country_name', 'vi.visa_fee', 'vi.processing_fee', 'vi.type', 'vi.max_validity', 'vi.description', 'vi.stay_validity', 'vi.processing_type', 'vi.status')
            .join('dbo.country as con', 'vi.country_id', 'con.id')
            .where((qb) => {
                if (query.country_id) {
                    qb.andWhere('vi.country_id', query.country_id);
                }
                if (query.status !== undefined) {
                    qb.andWhere('vi.status', query.status);
                }
            })
            .orderBy('vi.id', 'desc')
            .limit(query.limit || 100)
            .offset(query.skip || 0);

        let total: any[] = [];

        if (is_total) {
            total = await this.db('services.visa as vi')
                .count('vi.id as total')
                .join('dbo.country as con', 'vi.country_id', 'con.id')
                .where((qb) => {
                    if (query.country_id) {
                        qb.andWhere('vi.country_id', query.country_id);
                    }
                    if (query.status !== undefined) {
                        qb.andWhere('vi.status', query.status);
                    }
                })
        }

        return {
            data,
            total: total[0]?.total,
        }
    }

    //get single visa
    public async single(id: number, status?: boolean) {
        return this.db('services.visa as vi')
            .select('vi.id', 'vi.country_id', 'con.name as country_name', 'visa_fee', 'processing_fee', 'max_validity', 'type', 'description', 'stay_validity', 'visa_mode', 'processing_type', 'documents_details', 'status')
            .join('dbo.country as con', 'con.id', 'vi.country_id')
            .where('vi.id', id)
            .andWhere((qb) => {
                if (status !== undefined) {
                    qb.andWhere('vi.status', status)
                }
            });
    }

    //update
    public async update(payload: IUpdateVisaPayload, id: number) {
        return this.db('visa')
            .withSchema(this.SERVICE_SCHEMA)
            .update(payload)
            .where({ id });
    }





    //----B2C application----//
    //create app
    public async b2cCreateApplication(payload: ICreateB2CApplicationPayload) {
        return this.db('visa_application')
            .withSchema(this.BOOKING_SCHEMA)
            .insert(payload, 'id')
    }

    //create traveler
    public async b2cCreateTraveler(payload: ICreateAppTravelerPayload | ICreateAppTravelerPayload[]) {
        return this.db('visa_application_traveller')
            .withSchema(this.BOOKING_SCHEMA)
            .insert(payload, 'id')
    }

    //create tracking
    public async b2cCreateTracking(payload: ICreateAppTrackingPayload) {
        return this.db('visa_application_tracking')
            .withSchema(this.BOOKING_SCHEMA)
            .insert(payload, 'id')
    }

    //get app
    public async getB2CApplication(query: IGetApplicationQuery, is_total: boolean = false) {
        const data = await this.db('booking.visa_application as va')
            .select('va.id', 'va.user_id', 'us.username', 'us.first_name', 'us.last_name', 'va.visa_id', 'visa.max_validity', 'visa.type', 'visa.description', 'va.from_date', 'va.to_date', 'va.traveler', 'va.visa_fee', 'va.processing_fee', 'va.payable', 'va.application_date', 'va.contact_email', 'va.contact_number')
            .join('user.users as us', 'us.id', 'va.user_id')
            .join('services.visa', 'visa.id', 'va.visa_id')
            .where((qb) => {
                if (query.user_id) {
                    qb.andWhere('va.user_id', query.user_id);
                }
                if (query.filter) {
                    qb.andWhere((qbc) => {
                        qbc.whereILike('us.username', `%${query.filter}%`)
                        qbc.orWhereILike('va.contact_email', `%${query.filter}%`)
                        qbc.orWhereILike('va.contact_number', `%${query.filter}%`)
                        qbc.orWhereRaw(
                            "LOWER(us.first_name || ' ' || us.last_name) LIKE LOWER(?)",
                            [`%${query.filter ? query.filter.toLocaleLowerCase() : undefined}%`]
                        )
                    })
                }
                if (query.from_date && query.to_date) {
                    qb.andWhereBetween('va.application_date', [query.from_date, query.to_date]);
                }
            })
            .orderBy('va.id', 'desc')
            .limit(query.limit || 100)
            .offset(query.skip || 0)

        let total: any[] = [];
        if (is_total) {
            total = await this.db('booking.visa_application as va')
                .count('va.id as total')
                .join('user.users as us', 'us.id', 'va.user_id')
                .where((qb) => {
                    if (query.user_id) {
                        qb.andWhere('va.user_id', query.user_id);
                    }
                    if (query.filter) {
                        qb.andWhere((qbc) => {
                            qbc.whereILike('us.username', `%${query.filter}%`)
                            qbc.orWhereILike('va.contact_email', `%${query.filter}%`)
                            qbc.orWhereILike('va.contact_number', `%${query.filter}%`)
                            qbc.orWhereRaw(
                                "LOWER(us.first_name || ' ' || us.last_name) LIKE LOWER(?)",
                                [`%${query.filter ? query.filter.toLocaleLowerCase() : undefined}%`]
                            )
                        })
                    }
                    if (query.from_date && query.to_date) {
                        qb.andWhereBetween('va.application_date', [query.from_date, query.to_date]);
                    }
                })
        }
        return { data, total: total[0]?.total }
    }

    //single application
    public async b2cSingleApplication(id: number, user_id?: number) {
        return await this.db('booking.visa_application as va')
            .select('va.id', 'va.user_id', 'us.username', 'va.visa_id', 'visa.max_validity', 'visa.type', 'visa.description', 'va.from_date', 'va.to_date', 'va.traveler', 'va.visa_fee', 'va.processing_fee', 'va.payable', 'va.application_date', 'va.contact_email', 'va.contact_number', 'va.whatsapp_number')
            .join('user.users as us', 'us.id', 'va.user_id')
            .join('services.visa', 'visa.id', 'va.visa_id')
            .where('va.id', id)
            .andWhere((qb) => {
                if (user_id) {
                    qb.andWhere('va.user_id', user_id);
                }
            })
    }

    //traveler list
    public async b2cTravelerList(id: number) {
        return await this.db('booking.visa_application_traveller as vat')
            .select('vat.id', 'title', 'first_name', 'last_name', 'type', 'date_of_birth', 'passport_number', 'passport_expiry_date', 'city', 'con.name as country_name', 'address', 'passport_type', 'vat.type')
            .leftJoin('dbo.country as con', 'con.id', 'vat.country_id')
            .where('vat.application_id', id)
            .orderBy('vat.id', 'asc')
    }

    //tracking list
    public async b2cTrackingList(id: number) {
        return await this.db('visa_application_tracking')
            .withSchema(this.BOOKING_SCHEMA)
            .select('id', 'status', 'details', 'created_date')
            .where('application_id', id)
            .orderBy('id', 'asc')
    }
    //----B2C application----//




    //----B2B application----//
    //create app
    public async b2bCreateApplication(payload: ICreateB2BApplicationPayload) {
        return this.db('visa_application')
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id')
    }

    //create traveler
    public async b2bCreateTraveler(payload: ICreateAppTravelerPayload | ICreateAppTravelerPayload[]) {
        return this.db('visa_application_traveller')
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id')
    }

    //create tracking
    public async b2bCreateTracking(payload: ICreateAppTrackingPayload) {
        return this.db('visa_application_tracking')
            .withSchema(this.BTOB_SCHEMA)
            .insert(payload, 'id')
    }

    //get app
    public async getB2BApplication(query: IGetB2BApplicationQuery, is_total: boolean = false) {
        const data = await this.db('b2b.visa_application as va')
            .select('va.id', 'va.agent_id', 'va.agency_id', 'ai.agency_name', 'ai.agency_logo', 'bu.name as agent_name', 'va.visa_id', 'visa.max_validity', 'visa.type', 'visa.description', 'va.from_date', 'va.to_date', 'va.traveler', 'va.visa_fee', 'va.processing_fee', 'va.payable', 'va.application_date', 'va.contact_email', 'va.contact_number')
            .join('b2b.agency_info as ai', 'ai.id', 'va.agency_id')
            .join('b2b.btob_user as bu', 'bu.id', 'va.agent_id')
            .join('services.visa', 'visa.id', 'va.visa_id')
            .where((qb) => {
                if (query.agent_id) {
                    qb.andWhere('va.agent_id', query.agent_id);
                }
                if (query.filter) {
                    qb.andWhere((qbc) => {
                        qbc.whereILike('ai.agency_name', `%${query.filter}%`)
                        qbc.orWhereILike('va.contact_email', `%${query.filter}%`)
                        qbc.orWhereILike('va.contact_number', `%${query.filter}%`)
                        qbc.orWhereILike('bu.name', `%${query.filter}%`)
                    })
                }
                if (query.from_date && query.to_date) {
                    qb.andWhereBetween('va.application_date', [query.from_date, query.to_date]);
                }
            })
            .orderBy('va.id', 'desc')
            .limit(query.limit || 100)
            .offset(query.skip || 0)

        let total: any[] = [];
        if (is_total) {
            total = await this.db('b2b.visa_application as va')
                .count('va.id as total')
                .join('b2b.agency_info as ai', 'ai.id', 'va.agency_id')
                .join('b2b.btob_user as bu', 'bu.id', 'va.agent_id')
                .where((qb) => {
                    if (query.agent_id) {
                        qb.andWhere('va.agent_id', query.agent_id);
                    }
                    if (query.filter) {
                        qb.andWhere((qbc) => {
                            qbc.whereILike('ai.agency_name', `%${query.filter}%`)
                            qbc.orWhereILike('va.contact_email', `%${query.filter}%`)
                            qbc.orWhereILike('va.contact_number', `%${query.filter}%`)
                            qbc.orWhereILike('bu.name', `%${query.filter}%`)
                        })
                    }
                    if (query.from_date && query.to_date) {
                        qb.andWhereBetween('va.application_date', [query.from_date, query.to_date]);
                    }
                })
        }
        return { data, total: total[0]?.total }
    }

    //single application
    public async b2bSingleApplication(id: number, agent_id?: number) {
        return await this.db('b2b.visa_application as va')
            .select('va.id',  'va.agent_id', 'va.agency_id', 'ai.agency_name', 'ai.agency_logo', 'bu.name as agent_name', 'va.visa_id', 'visa.max_validity', 'visa.type', 'visa.description', 'va.from_date', 'va.to_date', 'va.traveler', 'va.visa_fee', 'va.processing_fee', 'va.payable', 'va.application_date', 'va.contact_email', 'va.contact_number', 'va.whatsapp_number')
            .join('b2b.agency_info as ai', 'ai.id', 'va.agency_id')
            .join('b2b.btob_user as bu', 'bu.id', 'va.agent_id')
            .join('services.visa', 'visa.id', 'va.visa_id')
            .where('va.id', id)
            .andWhere((qb) => {
                if (agent_id) {
                    qb.andWhere('va.agent_id', agent_id);
                }
            })
    }

    //traveler list
    public async b2bTravelerList(id: number) {
        return await this.db('b2b.visa_application_traveller as vat')
            .select('vat.id', 'title', 'first_name', 'last_name', 'type', 'date_of_birth', 'passport_number', 'passport_expiry_date', 'city', 'con.name as country_name', 'address', 'passport_type', 'vat.type')
            .leftJoin('dbo.country as con', 'con.id', 'vat.country_id')
            .where('vat.application_id', id)
            .orderBy('vat.id', 'asc')
    }

    //tracking list
    public async b2bTrackingList(id: number) {
        return await this.db('visa_application_tracking')
            .withSchema(this.BTOB_SCHEMA)
            .select('id', 'status', 'details', 'created_date')
            .where('application_id', id)
            .orderBy('id', 'asc')
    }
    //----B2B application----//

}