"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validationHandler_1 = require("../validationHandler/validationHandler");
class AuthValidator {
    constructor() {
        this.signUpValidation = [
            (0, express_validator_1.body)("name").notEmpty().withMessage("name is required"),
            (0, express_validator_1.body)("username")
                .notEmpty()
                .withMessage("Username is required")
                .matches(/^\S+$/)
                .withMessage("Username must not contain spaces"),
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage("email is required")
                .isEmail()
                .withMessage("email is not valid"),
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage("password is required")
                .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
                .withMessage("password is not strong enough"),
            validationHandler_1.validationHandler,
        ];
        this.loginValidation = [
            (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"),
            validationHandler_1.validationHandler,
        ];
        this.forgetPassword = [
            (0, express_validator_1.body)("email")
                .notEmpty()
                .withMessage("email is required")
                .isEmail()
                .withMessage("email is not valid"),
            validationHandler_1.validationHandler,
        ];
        this.resetPassword = [
            (0, express_validator_1.body)("password")
                .notEmpty()
                .withMessage("password is required")
                .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
                .withMessage("password is not strong enough"),
            validationHandler_1.validationHandler,
        ];
        this.changePassword = [
            (0, express_validator_1.body)("oldPassword").notEmpty().withMessage("Password lama wajib diisi"),
            (0, express_validator_1.body)("newPassword")
                .notEmpty()
                .withMessage("Password baru wajib diisi")
                .isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
                .withMessage("Password baru kurang kuat"),
            validationHandler_1.validationHandler,
        ];
    }
}
exports.default = AuthValidator;
