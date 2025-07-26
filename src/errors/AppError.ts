//error handle

class AppError {
  public rc: number; //rc (response code)
  public readonly success: boolean;
  public message: string;
  public payload?: any;

  constructor(_message: string, _rc: number, _payload?: any) {
    this.message = _message;
    this.rc = _rc;
    this.success = false; //default false
    this.payload = _payload;
  }
}

export default AppError;
