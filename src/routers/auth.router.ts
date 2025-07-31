import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../middleware/validations/auth.validation";
import { verifyToken } from "../middleware/verifyToken";

class AuthRouter {
  private route: Router;

  //start kontroler deklarasi
  private authController = new AuthController();
  //end controller deklarasi

  //start middleware deklarasi
  private authValidator = new AuthValidator();
  //end middleware deklarasi

  constructor() {
    //inisialisasi
    this.route = Router();
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
      "/login",
      this.authValidator.loginValidation,
      this.authController.logIn
    );
    this.route.post(
      "/forget-password",
      this.authValidator.forgetPassword,
      this.authController.forgetPassword
    );
    this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
    this.route.get("/verify", this.authController.verifyUser);
    this.route.get("/keep-login", this.authController.keepLogin);
    this.route.post(
      "/reset-password",
      this.authValidator.resetPassword,
      this.authController.resetPassword
    );
    this.route.get("/switch-role/:role", this.authController.switchRole);
  };

  public getRouter = () => {
    return this.route;
  };
}

export default AuthRouter;
