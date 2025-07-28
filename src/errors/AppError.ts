import { IvalidationError } from "../middleware/validationHandler/validationHandler";

//error handle
class AppError {
  public rc: number; //rc (response code)
  public readonly success: boolean;
  public message: string;
  public arrValidationErr?: IvalidationError[];

  constructor(
    _message: string,
    _rc: number,
    _arrValidationErr?: IvalidationError[]
  ) {
    this.message = _message;
    this.rc = _rc;
    this.success = false; //default false
    this.arrValidationErr = _arrValidationErr;
  }
}

export default AppError;
