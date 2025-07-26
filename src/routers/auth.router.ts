import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../middleware/validations/auth.validation";

class AuthRouter {
  private route: Router;

  //start kontroler deklarasi
  private authController: AuthController;
  //end controller deklarasi

  //start middleware deklarasi
  private authValidator: AuthValidator;
  //end middleware deklarasi

  constructor() {
    //inisialisasi
    this.route = Router();
    this.authController = new AuthController();
    this.authValidator = new AuthValidator();
    this.initializeRouter();
  }
  private initializeRouter = (): void => {
    //auth controller
    this.route.post(
      "/sign-up",
      this.authValidator.signUpValidation,
      this.authController.signUp
    );
    this.route.get(
      "/email/:email",
      this.authValidator.isEmailExist,
      this.authController.isEmailExist
    );
    this.route.get(
      "/username/:username",
      this.authValidator.isUsernameExist,
      this.authController.isUsernameExist
    );
  };

  public getRouter = () => {
    return this.route;
  };
}

export default AuthRouter;
