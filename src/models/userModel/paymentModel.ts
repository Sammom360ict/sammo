import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import { ICreateInvoicePayload, ICreatePaymentTryPayload, IUpdatePaymentTryPayload } from '../../utils/interfaces/user/paymentInterface';
import Schema from '../../utils/miscellaneous/schema';

export default class PaymentModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // insert invoice model
  public async insertInvoice(payload: ICreateInvoicePayload) {
    return await this.db('invoice')
      .withSchema(this.DBO_SCHEMA)
      .insert(payload, 'id');
  }

  // create payment try
  public async createPaymentTry(payload: ICreatePaymentTryPayload) {
    return await this.db('payment_try').withSchema(this.DBO_SCHEMA).insert(payload, 'id');
  }

  // get payment try
  public async getSinglePaymentTry(id: number, user_id: number) {
    return await this.db('dbo.payment_try AS bpt')
      .select(
        'bpt.id',
        'bpt.status',
        'bpt.booking_id',
        'bpt.user_id',
        'fb.payable_amount',
        'fb.pnr_code',
        'fb.status'
      )
      .join('booking.flight_booking AS fb', 'bpt.booking_id', 'fb.id')
      .andWhere('bpt.user_id', user_id)
      .andWhere('bpt.id', id);
  }

  // update payment try
  public async updatePaymentTry(
    payload: IUpdatePaymentTryPayload,
    id: number | string
  ) {
    return await this.db('dbo.payment_try').update(payload).where({ id });
  }

  //get transactions
  public async getTransactions(userId?: number,limit?:any,skip?:any, booking_id?:any){
    const data =  await this.db("dbo.invoice as inv")
    .select('inv.id','us.username','us.first_name','us.last_name','us.email','us.phone_number','inv.total_amount','inv.booking_id','inv.session_id','inv.type','inv.bank_tran_id','inv.transaction_date','fb.pnr_code','fb.status','fb.ticket_price','fb.base_fare','fb.total_tax','fb.payable_amount','fb.ait','fb.discount','fb.total_passenger','fb.journey_type')
    .leftJoin('booking.flight_booking as fb','inv.booking_id','fb.id')
    .join('user.users as us','us.id','inv.user_id')
    .orderBy('inv.id','desc')
    .limit(limit || 100)
    .offset(skip || 0)
    .where((qb)=>{
      if(userId){
        qb.andWhere('inv.user_id',userId);
      }
      if(booking_id){
        qb.andWhere('inv.booking_id',booking_id)
      }
    })

    let count: any[] = [];
    count = await this.db("dbo.invoice as inv")
    .count('inv.id as total')
    .leftJoin('booking.flight_booking as fb','inv.booking_id','fb.id')
    .where((qb)=>{
      if(userId){
        qb.andWhere('inv.user_id',userId);
      }
      if(booking_id){
        qb.andWhere('inv.booking_id',booking_id)
      }
    })

    return {data, total:count[0]?.total}
  }

}
