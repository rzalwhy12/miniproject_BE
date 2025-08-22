"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = __importDefault(require("../controllers/voucher.controller"));
const verifyToken_1 = require("../middleware/verifyToken");
class VoucherRouter {
    constructor() {
        this.voucherController = new voucher_controller_1.default();
        this.initializeRouter = () => {
            this.route.post("/apply", verifyToken_1.verifyToken, this.voucherController.applyVoucher);
            this.route.get("/", this.voucherController.getVouchers);
            this.route.get("/event/:eventId", this.voucherController.getVouchersByEventId);
        };
        this.getRouter = () => {
            return this.route;
        };
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = VoucherRouter;
