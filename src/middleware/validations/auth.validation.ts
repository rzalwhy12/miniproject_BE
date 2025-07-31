import { body } from "express-validator";
import { validationHandler } from "../validationHandler/validationHandler";

class AuthValidator {
  public signUpValidation = [
    body("name").notEmpty().withMessage("name is required"),

    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .matches(/^\S+$/)
      .withMessage("Username must not contain spaces"),

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

  public loginValidation = [
    body("password").notEmpty().withMessage("password is required"),

    validationHandler,
  ];
  public forgetPassword = [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid"),
    validationHandler,
  ];
  public resetPassword = [
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
}

export default AuthValidator;
