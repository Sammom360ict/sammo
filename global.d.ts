import {} from '';
import {
  IAdmin,
  IB2BAgent,
  IUser,
} from './src/features/common/commonUtils/types/commonTypes';
declare global {
  namespace Express {
    interface Request {
      upFiles: string[];
      admin: IAdmin;
      agency: IB2BAgent;
      user: IUser;
    }
  }
}
