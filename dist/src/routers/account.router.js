"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const accounts_controller_1 = __importDefault(require("../controllers/accounts.controller"));
const uploader_1 = require("../middleware/uploader");
const auth_validation_1 = __importDefault(require("../middleware/validations/auth.validation"));
class AccountRouter {
    //end middleware deklarasi
    constructor() {
        //start kontroler deklarasi
        this.accountController = new accounts_controller_1.default();
        //end controller deklarasi
        //start middleware deklarasi
        this.authValidation = new auth_validation_1.default();
        this.initializeRouter = () => {
            this.route.use(verifyToken_1.verifyToken); //semua yang perlu verifyToken dibawah sini
            this.route.get("/get-data", this.accountController.getDataUser);
            this.route.get("/coupons", this.accountController.getCoupons);
            this.route.patch("/update-data", this.accountController.updateProfile);
            this.route.patch("/update-profile-image", (0, uploader_1.uploadMemory)().single("profileImage"), this.accountController.updateProfile);
            this.route.patch("/update-password", this.authValidation.changePassword, this.accountController.changePassword);
            this.route.get("/verify-email", this.accountController.verifyEmail);
        };
        this.getRouter = () => {
            return this.route;
        };
        //inisialisasi
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = AccountRouter;
