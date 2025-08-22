"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = __importDefault(require("../errors/AppError"));
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const generateToken = (objectToken, expiresIn = "1y") => {
    if (!process.env.TOKEN_KEY) {
        throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.SERVER_MISSING_SECRET_KEY, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
    }
    return (0, jsonwebtoken_1.sign)(objectToken, process.env.TOKEN_KEY, { expiresIn });
};
exports.generateToken = generateToken;
