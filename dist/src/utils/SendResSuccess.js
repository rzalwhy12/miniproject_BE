"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResSuccess = void 0;
//funct handler response successs
const sendResSuccess = (res, message, statusCode, data, token) => {
    return res.status(statusCode).json({
        result: { success: true, message, data, token },
    });
};
exports.sendResSuccess = sendResSuccess;
