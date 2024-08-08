import AbstractServices from "../../../../abstract/abstract.service";
import axios from "axios";
import config from "../../../../config/config";
import { SERVER_URL } from "../../../../utils/miscellaneous/constants";
import qs from 'qs';
import { ISSLPaymentPayload } from "../../utils/types/sslPayment.interface";

export class BookingPaymentService extends AbstractServices {


    //ssl payment
    public async sslPayment(body: ISSLPaymentPayload) {
        try {

            const ssl_body = {
                ...body,
                store_id: config.SSL_STORE_ID,
                store_passwd: config.SSL_STORE_PASSWORD,
                success_url: `${SERVER_URL}/payment/success`,
                fail_url: `${SERVER_URL}/payment/failed`,
                cancel_url: `${SERVER_URL}/payment/cancelled`,
                shipping_method: "no",
                product_category: "General",
                product_profile: "General"
            }

            const response: any = await axios.post(`${config.SSL_URL}/gwprocess/v4/api.php`, qs.stringify(ssl_body),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

            if (response?.data?.status === "SUCCESS") {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    redirect_url: response.data.redirectGatewayURL
                }
            } else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                    message: "Something went wrong!"
                }
            }

        } catch (err) {
            console.log('SSL ERROR', err);
            return {
                success: false,
                code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
                message: "Something went wrong"
            }
        }
    }
}