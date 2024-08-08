import CommonValidator from '../features/common/commonUtils/validators/commonValidator';
import Wrapper from '../middleware/asyncWrapper/middleware';
import CustomError from '../utils/lib/customError';
import ResMsg from '../utils/miscellaneous/responseMessage';
import StatusCode from '../utils/miscellaneous/statusCode';

abstract class AbstractController {
  protected asyncWrapper: Wrapper;
  protected commonValidator = new CommonValidator();
  constructor() {
    this.asyncWrapper = new Wrapper();
  }
  protected StatusCode = StatusCode;
  protected error(message?: string, status?: number) {
    throw new CustomError(
      message || ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      status || StatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
export default AbstractController;
