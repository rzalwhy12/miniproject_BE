"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
const account_reposetory_1 = __importDefault(require("../repositories/account.reposetory"));
const sendEmail_1 = require("../utils/sendEmail");
const verifyEmail_template_1 = require("../template/verifyEmail.template");
const generateToken_1 = require("../utils/generateToken");
class AccountService {
    constructor() {
        this.accountRepository = new account_reposetory_1.default();
        //define method
        this.updateProfile = async (id, dataUser) => {
            const user = await this.accountRepository.updateUser(id, dataUser);
            if (!user) {
                throw new AppError_1.default("Cannot update profile", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            return user;
        };
        this.getDataUser = async (id) => {
            const user = await this.accountRepository.getDataUser(id);
            if (!user) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.CANNOT_GET_DATA, statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            return user;
        };
        this.gantiPassword = async (userId, oldPassword, newPassword) => {
            const user = await this.accountRepository.getDataUser(userId);
            if (!user) {
                throw new AppError_1.default("Cannot get data user", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            const comparePass = await (0, bcrypt_1.compare)(oldPassword, user.password);
            if (!comparePass) {
                throw new AppError_1.default("Password incorrect", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const updatePass = await this.accountRepository.newPassword(userId, newPassword);
            if (!updatePass) {
                throw new AppError_1.default("Cannot Change Password", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            return updatePass;
        };
        this.requestEmialVerify = async (userId) => {
            const user = await this.accountRepository.getDataUser(userId);
            if (!user) {
                throw new AppError_1.default("User Not Found", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const token = (0, generateToken_1.generateToken)({
                id: user.id,
                email: user.email,
                isverified: user.isVerified,
                rememberMe: false,
            });
            if (!token) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.SERVER_MISSING_SECRET_KEY, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            const subject = "Verify Your Email";
            const urlFE = `${process.env.BASIC_URL_FE}/verify/${token}`;
            (0, sendEmail_1.sendEmail)(user.email, subject, (0, verifyEmail_template_1.verifyEmailTemplate)(user.name, urlFE));
            return user;
        };
    }
    async getCoupons(userId) {
        return await this.accountRepository.getCoupons(userId);
    }
}
exports.default = AccountService;
