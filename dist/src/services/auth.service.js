"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const bcrypt_1 = require("bcrypt");
const dayjs_1 = __importDefault(require("dayjs"));
const sendEmail_1 = require("../utils/sendEmail");
const verifyEmail_template_1 = require("../template/verifyEmail.template");
const generateToken_1 = require("../utils/generateToken");
const client_1 = require("../../prisma/generated/client");
const resetPassword_template_1 = require("../template/resetPassword.template");
//logicnya di service
class AuthServices {
    constructor() {
        //define class
        this.authRepository = new auth_repository_1.default();
        //method define
        this.signUp = async (dataSignUp) => {
            let newUser;
            const subject = "Verify Your Email";
            //if daftar tanpa referral
            if (!dataSignUp.referralCode) {
                newUser = await this.authRepository.createUser(dataSignUp);
            }
            else {
                //pake referral
                const userGivenReferral = await this.authRepository.findAccount({
                    referral: dataSignUp.referralCode,
                });
                if (!userGivenReferral) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.REFERRAL_GIVEN_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                newUser = await this.authRepository.createUser(dataSignUp);
                const referral = await this.authRepository.addReferral({
                    referrerId: userGivenReferral.id,
                    referredId: newUser.id,
                });
                const expiresAt = (0, dayjs_1.default)().add(3, "month").toDate();
                await this.authRepository.addCoupon({
                    discount: 10,
                    expiresAt,
                    referralId: referral.id,
                });
                //point ketika user memberikan referralnya 10.000
                await this.authRepository.addPoint({
                    userId: userGivenReferral.id,
                    amount: 10000,
                    expiresAt,
                });
            }
            //after create send emailverify
            const token = (0, generateToken_1.generateToken)({
                id: newUser.id,
                email: newUser.email,
                isverified: newUser.isVerified,
                activeRole: client_1.RoleName.CUSTOMER,
                rememberMe: false,
            });
            if (!token) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.SERVER_MISSING_SECRET_KEY, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            const urlFE = `${process.env.BASIC_URL_FE}/verify/${token}`;
            (0, sendEmail_1.sendEmail)(newUser.email, subject, (0, verifyEmail_template_1.verifyEmailTemplate)(newUser.name, urlFE));
            await this.authRepository.addRole(newUser.id);
            return newUser;
        };
        //live isexist email dan username service
        this.isExist = async (field) => {
            const isExist = await this.authRepository.findAccount(field);
            return isExist;
        };
        this.loginUser = async (dataLogin, passwordBody) => {
            const user = await this.authRepository.findAccount(dataLogin);
            if (!user) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INVALID_EMAIL_OR_PASSWORD, statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const comparePassword = await (0, bcrypt_1.compare)(passwordBody, user.password);
            return { user, comparePassword };
        };
        this.verifyUser = async (id) => {
            const isVerify = !!(await prisma_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    isVerified: true,
                },
            }));
            return isVerify;
        };
        this.keepLogin = async (id) => {
            const user = await this.authRepository.findAccount({
                id,
            });
            return user;
        };
        this.forgetPassword = async (email) => {
            const user = await this.authRepository.findAccount({
                email,
            });
            if (!user) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.EMAIL_NOT_FOUND, statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            const token = (0, generateToken_1.generateToken)({
                id: user.id,
                email: user.email,
                isverified: user.isVerified,
                activeRole: user.roles[0].role.name,
                rememberMe: false,
            });
            const urlFE = `${process.env.BASIC_URL_FE}/reset-password/${token}`;
            const subject = "Reset Your Password";
            (0, sendEmail_1.sendEmail)(user.email, subject, (0, resetPassword_template_1.resetPasswordTemplate)(user.name, urlFE));
            return user;
        };
        this.resetPassword = async (id, password) => {
            const user = await this.authRepository.resetPassword(id, password);
            return user;
        };
    }
}
exports.default = AuthServices;
