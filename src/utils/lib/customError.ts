interface IError {
    status: number;
    message:string;
  }
  
  class CustomError extends Error implements IError {
    message:string;
    status: number;
  
    constructor(message: string, status: number, ) {
      super(message);
      this.status = status;
      this.message= message
    }
  }
  
  export default CustomError;
  