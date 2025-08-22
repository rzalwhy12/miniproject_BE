"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_service_1 = __importDefault(require("../services/account.service"));
const SendResSuccess_1 = require("../utils/SendResSuccess");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const cloudinary_1 = require("../config/cloudinary");
const account_reposetory_1 = __importDefault(require("../repositories/account.reposetory"));
const user_mapper_1 = require("../mappers/user.mapper");
const AppError_1 = __importDefault(require("../errors/AppError"));
class AccountController {
    constructor() {
        this.accountService = new account_service_1.default();
        this.accountRepository = new account_reposetory_1.default();
        //define method
        this.getDataUser = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const user = await this.accountService.getDataUser(userId);
                const couponUser = await this.accountRepository.getUserCoupon(userId);
                const pointUser = await this.accountRepository.getPoint(userId);
                if (user) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, user_mapper_1.mapUserToRes)(user, couponUser?.discount || null, couponUser?.expiresAt, pointUser.totalPoint, pointUser.soonestExpiry));
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const id = res.locals.decript.id;
                let upload;
                if (req.file) {
                    upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
                }
                const user = await this.accountService.updateProfile(id, {
                    ...req.body,
                    profileImage: upload?.secure_url,
                });
                if (user) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.UPDATE_DATA_USER, statusCode_enum_1.StatusCode.OK, user);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.uploadProfileImage = async (req, res, next) => {
            try {
                const id = res.locals.decript.id;
                let upload;
                if (req.file) {
                    upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
                }
                const user = await this.accountService.updateProfile(id, {
                    ...req.body,
                    profileImage: upload?.secure_url,
                });
                if (user) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.UPDATE_DATA_USER, statusCode_enum_1.StatusCode.OK, user);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.getCoupons = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const coupons = await this.accountService.getCoupons(userId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, coupons);
            }
            catch (error) {
                next(error);
            }
        };
        this.changePassword = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const { oldPassword, newPassword } = req.body;
                await this.accountService.gantiPassword(userId, oldPassword, newPassword);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
        this.verifyEmail = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                if (!userId) {
                    throw new AppError_1.default("UserId Required", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const user = await this.accountService.requestEmialVerify(userId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = AccountController;
