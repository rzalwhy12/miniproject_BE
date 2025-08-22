"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_service_1 = __importDefault(require("../services/voucher.service"));
const SendResSuccess_1 = require("../utils/SendResSuccess");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
class VoucherController {
    constructor() {
        this.applyVoucher = async (req, res, next) => {
            try {
                const { eventId, voucherCode } = req.body;
                if (!eventId || !voucherCode) {
                    throw new AppError_1.default("eventId and voucherCode are required", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const result = await voucher_service_1.default.applyVoucher(eventId, voucherCode);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getVouchers = async (req, res, next) => {
            try {
                const eventId = req.query.eventId ? parseInt(req.query.eventId) : undefined;
                const vouchers = await voucher_service_1.default.getVouchers(eventId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, vouchers);
            }
            catch (error) {
                next(error);
            }
        };
        this.getVouchersByEventId = async (req, res, next) => {
            try {
                const eventId = parseInt(req.params.eventId);
                if (isNaN(eventId)) {
                    throw new AppError_1.default("Invalid eventId", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const vouchers = await voucher_service_1.default.getVouchersByEventId(eventId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, vouchers);
            }
            catch (error) {
                next(error);
            }
        };
        this.getVouchersByEventID = async (req, res, next) => {
            try {
                const eventId = parseInt(req.params.eventId);
                if (isNaN(eventId)) {
                    throw new AppError_1.default("Invalid eventId", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const vouchers = await voucher_service_1.default.getVouchersByEventId(eventId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, vouchers);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = VoucherController;
