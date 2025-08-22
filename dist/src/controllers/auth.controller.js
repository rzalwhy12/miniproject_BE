"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const successMessage_enum_1 = require("../constants/successMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const SendResSuccess_1 = require("../utils/SendResSuccess");
const generateToken_1 = require("../utils/generateToken");
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
//controller tugasnya unutk mengirim response saja
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
        this.authRepository = new auth_repository_1.default();
        this.signUp = async (req, res, next) => {
            try {
                await this.authService.signUp(req.body);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.USER_CREATED, statusCode_enum_1.StatusCode.CREATED);
            }
            catch (error) {
                next(error);
            }
        };
        this.logIn = async (req, res, next) => {
            try {
                const { email, username, password, remeberMe } = req.body;
                const data = await this.authService.loginUser({ email, username }, password);
                if (!data.comparePassword) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INVALID_EMAIL_OR_PASSWORD, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const token = (0, generateToken_1.generateToken)({
                    id: data.user.id,
                    email: data.user.email,
                    isverified: data.user.isVerified,
                    activeRole: data.user.roles[0].role.name,
                    rememberMe: remeberMe,
                }, remeberMe ? "7d" : "1h");
                if (!token) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                console.log("start");
                console.log(data.user);
                console.log("end");
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.USER_LOGGED_IN, statusCode_enum_1.StatusCode.OK, { name: data.user.name, role: data.user.roles[0].role.name }, token);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyUser = async (req, res, next) => {
            try {
                const isVerify = await this.authService.verifyUser(res.locals.decript.id);
                if (isVerify) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.EMAIL_VERIFIED, statusCode_enum_1.StatusCode.OK);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.keepLogin = async (req, res, next) => {
            try {
                const data = await this.authService.keepLogin(res.locals.decript.id);
                if (!data) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                const activeRole = data.roles.find((r) => r.isActive);
                if (!activeRole) {
                    throw new AppError_1.default("Active role not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.USER_LOGGED_IN, statusCode_enum_1.StatusCode.OK, {
                    name: data.name,
                    role: activeRole.role.name,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.forgetPassword = async (req, res, next) => {
            try {
                const user = await this.authService.forgetPassword(req.body.email);
                if (!user) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        this.resetPassword = async (req, res, next) => {
            try {
                const user = await this.authService.resetPassword(res.locals.decript.id, req.body.password);
                if (!user) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                console.log(user);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        this.switchRole = async (req, res, next) => {
            try {
                const targetRole = parseInt(req.params.role);
                if (isNaN(targetRole)) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INVALID_ROLE_ID, statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const userId = res.locals.decript.id;
                const remeberMe = res.locals.decript.remeberMe;
                // Switch role (ubah active role di DB)
                const newActiveRole = await this.authRepository.switchRoleRepo(userId, targetRole);
                if (!newActiveRole) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                // Ambil user lengkap dengan roles
                const user = await this.authRepository.findAccount({ id: userId });
                if (!user || !user.roles || user.roles.length === 0) {
                    throw new AppError_1.default("User or role not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                const activeRole = user.roles.find((r) => r.isActive);
                if (!activeRole) {
                    throw new AppError_1.default("Active role not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                const token = (0, generateToken_1.generateToken)({
                    id: user.id,
                    email: user.email,
                    isverified: user.isVerified,
                    activeRole: activeRole.role.name,
                    rememberMe: remeberMe,
                }, remeberMe ? "7h" : "1h");
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, { name: user.name, role: activeRole.role.name }, token);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AuthController;
