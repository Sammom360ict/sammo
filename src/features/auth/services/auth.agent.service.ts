import { Request } from 'express';
import AbstractServices from '../../../abstract/abstract.service';
import Lib from '../../../utils/lib/lib';
import config from '../../../config/config';
import {
    ILoginPayload,
    IForgetPasswordPayload,
} from '../../common/commonUtils/types/commonTypes';

class AgentAuthService extends AbstractServices {
    //login
    public async loginService(req: Request) {
        const { email, password } = req.body as ILoginPayload;
        const model = this.Model.agencyModel();
        const checkUser = await model.getSingleUser({ email });
        console.log(checkUser);
        if (!checkUser.length) {
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.WRONG_CREDENTIALS,
            };
        }

        const { hashed_password: hashPass, agency_id, ...rest } = checkUser[0];
        const checkPass = await Lib.compare(password, hashPass);

        if (!checkPass) {
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.WRONG_CREDENTIALS,
            };
        }

        const getAgency = await model.getSingleAgency(Number(agency_id));

        if (rest.status == false) {
            return {
                success: false,
                code: this.StatusCode.HTTP_FORBIDDEN,
                message: "Your account has been disabled"
            }
        }

        if (getAgency[0]?.status == false) {
            return {
                success: false,
                code: this.StatusCode.HTTP_FORBIDDEN,
                message: "Your agency account has been disabled"
            }
        }

        const token_data = {
            id: rest.id,
            name: rest.name,
            email: rest.email,
            mobile_number: rest.mobile_number,
            photo: rest.photo,
            user_status: rest.status,
            agency_id: agency_id,
            agency_logo: getAgency[0].agency_logo,
            agency_name: getAgency[0].agency_name,
            agency_status: getAgency[0].status
        };
        const token = Lib.createToken(token_data, config.JWT_SECRET_ADMIN, '48h');
        return {
            success: true,
            code: this.StatusCode.HTTP_OK,
            message: this.ResMsg.LOGIN_SUCCESSFUL,
            data: token_data,
            token,
        };
    }

    //forget pass
    public async forgetPassword(req: Request) {
        const { token, email, password } = req.body as IForgetPasswordPayload;
        const token_verify: any = Lib.verifyToken(token, config.JWT_SECRET_AGENT);

        if (!token_verify) {
            return {
                success: false,
                code: this.StatusCode.HTTP_UNAUTHORIZED,
                message: this.ResMsg.HTTP_UNAUTHORIZED,
            };
        }

        const { email: verify_email } = token_verify;
        if (email === verify_email) {
            const hashed_pass = await Lib.hashPass(password);
            const model = this.Model.agencyModel();
            const get_user = await model.getSingleUser({ email });
            await model.updateAgencyUser(
                { hashed_password: hashed_pass },
                get_user[0].id
            );
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.PASSWORD_CHANGED,
            };
        } else {
            return {
                success: false,
                code: this.StatusCode.HTTP_FORBIDDEN,
                message: this.StatusCode.HTTP_FORBIDDEN,
            };
        }
    }


}

export default AgentAuthService;
