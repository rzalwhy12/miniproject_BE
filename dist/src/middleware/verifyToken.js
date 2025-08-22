"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = require("jsonwebtoken");
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.TOKEN_NOT_PROVIDED, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];
        console.log("run");
        console.log(token);
        if (!token) {
            throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.TOKEN_NOT_FOUND, statusCode_enum_1.StatusCode.UNAUTHORIZED);
        }
        console.log("run");
        console.log(token);
        if (!process.env.TOKEN_KEY) {
            throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.SERVER_MISSING_SECRET_KEY, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
        }
        const checkToken = (0, jsonwebtoken_1.verify)(token, process.env.TOKEN_KEY);
        res.locals.decript = checkToken;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
