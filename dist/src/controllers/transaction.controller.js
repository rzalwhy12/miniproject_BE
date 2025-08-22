"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const statusCode_enum_1 = require("../constants/statusCode.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const SendResSuccess_1 = require("../utils/SendResSuccess");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const client_1 = require("../../prisma/generated/client");
const transaction_repository_1 = __importDefault(require("../repositories/transaction.repository"));
const cloudinary_1 = require("../config/cloudinary");
const transaction_mapper_1 = require("../mappers/transaction.mapper");
class TransactionController {
    constructor() {
        this.getTransactionsByUserIdController = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                if (!userId) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.UNAUTHORIZED, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const transactions = await this.transactionService.fetchTransactionsByUserId(userId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, transactions);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTransactionByCode = async (req, res, next) => {
            try {
                const { transactionCode } = req.params;
                const transaction = await this.transactionService.getTransactionByCode(transactionCode);
                if (!transaction) {
                    throw new AppError_1.default("Transaction not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, transaction);
            }
            catch (error) {
                next(error);
            }
        };
        this.transactionService = new transaction_service_1.default();
        this.transactionRepository = new transaction_repository_1.default();
        this.transaction = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const userRole = res.locals.decript.activeRole;
                const eventId = req.body.eventId;
                if (!userId) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.UNAUTHORIZED, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const event = await this.transactionRepository.findEventId(eventId);
                if (userId === event?.organizerId) {
                    throw new AppError_1.default("Organizer Cannot Create Transaction", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                if (userRole === client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default("Please switch to customer", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const result = await this.transactionService.createTransaction(userId, req.body);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.cutomerUploadProof = async (req, res, next) => {
            try {
                const transactionId = parseInt(req.params.transactionId);
                const customerId = res.locals.decript.id;
                if (res.locals.decript.activeRole !== client_1.RoleName.CUSTOMER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_CUSTOMER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const alreadyUpload = await this.transactionRepository.findTransaction(transactionId);
                if (alreadyUpload?.paymentProof) {
                    throw new AppError_1.default("Already Upload", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                let upload;
                if (req.file) {
                    upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
                }
                if (!upload?.secure_url) {
                    throw new AppError_1.default("Server Cannot Upload File", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                const uploadedProof = await this.transactionService.uploadProofPayment(transactionId, upload.secure_url, customerId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, uploadedProof);
            }
            catch (error) {
                next(error);
            }
        };
        this.organizerResponse = async (req, res, next) => {
            try {
                const transactionId = parseInt(req.params.transactionId);
                const { status } = req.body;
                const organizerId = res.locals.decript.id;
                if (res.locals.decript.activeRole !== client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_ORGANIZER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                if (isNaN(transactionId)) {
                    throw new AppError_1.default("transactionId harus berupa angka", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const allowedStatus = [
                    client_1.TransactionStatus.DONE,
                    client_1.TransactionStatus.REJECTED,
                ];
                if (!allowedStatus.includes(status)) {
                    throw new AppError_1.default("Status transaksi tidak valid", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const transaction = await this.transactionService.organizerResponse(status, transactionId, organizerId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, transaction);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTransactionOrder = async (req, res, next) => {
            try {
                const organizerId = res.locals.decript.id;
                const transaction = await this.transactionService.getListOrder(organizerId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, transaction_mapper_1.mapOrderListToRes)(transaction));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = TransactionController;
