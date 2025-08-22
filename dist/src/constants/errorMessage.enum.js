"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMsg = void 0;
var ErrorMsg;
(function (ErrorMsg) {
    // General
    ErrorMsg["INTERNAL_SERVER_ERROR"] = "Internal server error";
    ErrorMsg["ROUTE_NOT_FOUND"] = "Route not found";
    // Auth
    ErrorMsg["INVALID_EMAIL_OR_PASSWORD"] = "Invalid email or password";
    ErrorMsg["UNAUTHORIZED"] = "Unauthorized access";
    ErrorMsg["TOKEN_NOT_FOUND"] = "Token not found";
    ErrorMsg["TOKEN_INVALID"] = "Invalid token";
    ErrorMsg["TOKEN_EXPIRED"] = "Token expired";
    ErrorMsg["TOKEN_NOT_PROVIDED"] = "no token provided";
    ErrorMsg["INVALID_INPUT"] = "Invalid input data";
    ErrorMsg["MISSING_QUERY_PARAMETERS"] = "Missing query parameters";
    ErrorMsg["SERVER_MISSING_SECRET_KEY"] = "server error missing secret key";
    ErrorMsg["UNKNOWN_ERROR"] = "Unknown errror";
    ErrorMsg["REFERRAL_GIVEN_NOT_FOUND"] = "ReferralCode not found";
    ErrorMsg["EMAIL_NOT_FOUND"] = "Email not Found";
    ErrorMsg["CANNOT_GET_DATA"] = "Cannot get data user";
    ErrorMsg["INVALID_ROLE_ID"] = "Invalid Role ID";
    //Event
    ErrorMsg["FAILD_CREATE_EVENT"] = "Faild Create Event";
    ErrorMsg["FAILD_UPDATE_EVENT"] = "Faild Update Event";
    ErrorMsg["MUST_BE_ORGANIZER"] = "Must Be Organizer";
    //Transaction
    ErrorMsg["MUST_BE_CUSTOMER"] = "Must Be Customer";
})(ErrorMsg || (exports.ErrorMsg = ErrorMsg = {}));
