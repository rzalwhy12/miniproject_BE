import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import AccountController from "../controllers/accounts.controller";
import { uploadMemory } from "../middleware/uploader";

class AccountRouter {
  private route: Router;

  //start kontroler deklarasi
  private accountController = new AccountController();
  //end controller deklarasi

  //start middleware deklarasi
  //end middleware deklarasi

  constructor() {
    //inisialisasi
    this.route = Router();
    this.initializeRouter();
  }
  private initializeRouter = (): void => {
    this.route.use(verifyToken); //semua yang perlu verifyToken dibawah sini
    this.route.get("/get-data", this.accountController.getDataUser);
    this.route.patch("/update-data", this.accountController.updateProfile);
    this.route.patch(
      "/update-profile-image",
      uploadMemory().single("profileImage"),
      this.accountController.updateProfile
    );
  };

  public getRouter = () => {
    return this.route;
  };
}

export default AccountRouter;
