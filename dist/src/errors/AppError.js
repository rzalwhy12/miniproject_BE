"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//error handle
class AppError {
    constructor(_message, _rc) {
        this.message = _message;
        this.rc = _rc;
        this.success = false; //default false
    }
}
exports.default = AppError;
