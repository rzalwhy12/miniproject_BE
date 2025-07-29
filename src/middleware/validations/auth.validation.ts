import { body } from "express-validator";
import { validationHandler } from "../validationHandler/validationHandler";
import { Gender } from "../../../prisma/generated/client";

class AuthValidator {
  public signUpValidation = [
    body("name").notEmpty().withMessage("name is required"),

    body("username").notEmpty().withMessage("username is required"),

    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),

    body("password")
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
    validationHandler,
  ];

  public isEmailExistValidation = [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),

    validationHandler,
  ];

  public isUsernameExistValidation = [
    body("username").notEmpty().withMessage("username is required"),
    validationHandler,
  ];

  public loginValidation = [
    body("password").notEmpty().withMessage("password is required"),

    validationHandler,
  ];
}

export default AuthValidator;
