"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_validation_1 = __importDefault(require("../middleware/validations/auth.validation"));
const verifyToken_1 = require("../middleware/verifyToken");
class AuthRouter {
    //end middleware deklarasi
    constructor() {
        //start kontroler deklarasi
        this.authController = new auth_controller_1.default();
        //end controller deklarasi
        //start middleware deklarasi
        this.authValidator = new auth_validation_1.default();
        this.initializeRouter = () => {
            //auth controller
            this.route.post("/sign-up", this.authValidator.signUpValidation, this.authController.signUp);
            this.route.post("/login", this.authValidator.loginValidation, this.authController.logIn);
            this.route.post("/forget-password", this.authValidator.forgetPassword, this.authController.forgetPassword);
            this.route.use(verifyToken_1.verifyToken); //semua yang perlu verifyToken dibawah sini
            this.route.get("/verify", this.authController.verifyUser);
            this.route.get("/keep-login", this.authController.keepLogin);
            this.route.post("/reset-password", this.authValidator.resetPassword, this.authController.resetPassword);
            this.route.get("/switch-role/:role", this.authController.switchRole);
        };
        this.getRouter = () => {
            return this.route;
        };
        //inisialisasi
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = AuthRouter;
