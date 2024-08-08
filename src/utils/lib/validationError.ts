import StatusCode from '../miscellaneous/statusCode';
interface INewValidation extends ValidationErr {
  path: string;
  msg: string;
}
interface IError {
  status: number;
  type: string;
}

class ValidationErr extends Error implements IError {
  status: number;
  type: string;

  constructor(error: any) {
    super(error.array()[0].msg);
    (this.status = StatusCode.HTTP_UNPROCESSABLE_ENTITY),
      (this.type = `Invalid input type for '${error.array()[0].path}'`);
    console.log(error.array()[0]);
  }
}

export default ValidationErr;
