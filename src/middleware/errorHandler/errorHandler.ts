import { Request, Response, NextFunction } from 'express';
import ManageFile from '../../utils/lib/manageFile';
import CustomError from '../../utils/lib/customError';

interface ICustomError {
  success: boolean;
  message: string;
}

class ErrorHandler {
  private customError: ICustomError;
  private manageFile: ManageFile;

  constructor() {
    this.customError = {
      success: false,
      message: 'Internal server error!',
    };

    this.manageFile = new ManageFile();
  }

  /**
   * handleErrors
   */
  public handleErrors = async (
    err: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    // // file removing starts
    const files = req.upFiles || [];

    if (files.length) {
      await this.manageFile.deleteFromCloud(files);
    }

    // if (err instanceof CustomError) {
    //   this.customError.message =
    //     err.message || 'Something went wrong, please try again later!';
    //   this.customError.type = err.type;
    //   this.customError.status = err.status;
    // } else {
    //   this.customError.message =
    //     'Something went wrong, please try again later!';
    //   this.customError.type = 'Internal Server Error';
    // }

    console.log(err, 'custom error');

    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  };
}

export default ErrorHandler;
