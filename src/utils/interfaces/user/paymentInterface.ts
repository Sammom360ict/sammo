export interface ICreateInvoicePayload{
    user_id: number;
    total_amount: number;
    booking_id?: number;
    booking_request_id?:number;
    description?: string;
    session_id: string;
    created_by?: number;
    type?: string;
    bank_tran_id?: string;
    transaction_date?: Date;
}

export interface ICreatePaymentTryPayload {
    booking_id: number;
    pnr_id: string;
    user_id: number;
    status: string;
    description?: string;
    amount: number;
    currency: string;
}
export interface IUpdatePaymentTryPayload {
    status: string;
    description?: string;
}