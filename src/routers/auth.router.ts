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
      "/login",
      this.authValidator.loginValidation,
      this.authController.login
    );
    this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
    this.route.get("/verify", this.authController.verifyUser);
    this.route.get("/keep-login", this.authController.keepLogin);
  };

  public getRouter = () => {
    return this.route;
  };
}

export default AuthRouter;
