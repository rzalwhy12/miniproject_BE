import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../middleware/validations/auth.validation";
import { verifyToken } from "../middleware/verifyToken";

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
    this.route.post(
      "/check-email",
      this.authValidator.isEmailExistValidation,
      this.authController.isEmailExist
    );
    this.route.post(
      "/check-username",
      this.authValidator.isUsernameExistValidation,
      this.authController.isUsernameExist
    );
    this.route.post(
      "/login",
      this.authValidator.loginValidation,
      this.authController.login
    );
    this.route.use(verifyToken);
    this.route.get("/verify", this.authController.verifyUser);
  };

  public getRouter = () => {
    return this.route;
  };
}

export default AuthRouter;
