"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationHandler = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const statusCode_enum_1 = require("../../constants/statusCode.enum");
const validationHandler = (req, res, next) => {
    try {
        const errorValidation = (0, express_validator_1.validationResult)(req);
        if (!errorValidation.isEmpty()) {
            const msgArrayError = errorValidation.array()[0].msg;
            throw new AppError_1.default(msgArrayError, statusCode_enum_1.StatusCode.BAD_REQUEST);
        }
        else {
            //jika tidak error, next ke controller
            next();
        }
    }
    catch (error) {
        next(error);
    }
};
exports.validationHandler = validationHandler;
