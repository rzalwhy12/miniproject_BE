import { body } from "express-validator";
import { validationHandler } from "../validationHandler/validationHandler";

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

    body("noTlp")
      .notEmpty()
      .withMessage("noTlp is required")
      .isMobilePhone("id-ID")
      .withMessage("noTlp must be a valid phone number"),

    body("brithDate")
      .notEmpty()
      .withMessage("brithDate is required")
      .isISO8601()
      .withMessage("brithDate must be a valid date")
      .toDate(),

    body("gender")
      .notEmpty()
      .withMessage("gender is required")
      .isIn(["MALE", "FEMALE"])
      .withMessage("gender must be either 'MALE' or 'FEMALE'"),

    validationHandler,
  ];
}

export default AuthValidator;
