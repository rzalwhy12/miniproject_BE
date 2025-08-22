"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const uploader_1 = require("../middleware/uploader");
class TransactionRouter {
    constructor() {
        this.transactionController = new transaction_controller_1.default();
        this.initializeRouter = () => {
            this.route.use(verifyToken_1.verifyToken);
            this.route.post("/create", this.transactionController.transaction);
            this.route.patch("/upload-payment/:transactionId", (0, uploader_1.uploadMemory)().single("paymentProof"), this.transactionController.cutomerUploadProof);
            this.route.patch("/confirmation/:transactionId", this.transactionController.organizerResponse);
            this.route.get("/order-list", this.transactionController.getTransactionOrder);
            this.route.get("/user-transactions", this.transactionController.getTransactionsByUserIdController);
            this.route.get("/:transactionCode", this.transactionController.getTransactionByCode);
        };
        this.getRouter = () => {
            return this.route;
        };
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = TransactionRouter;
