export interface ISSLPaymentPayload {
    total_amount: number;
    currency: string;
    tran_id: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_country: string;
    cus_phone: string;
    product_name: string;
    product_profile?: number | string;
}