import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { SuccessMsg } from "../constants/successMessage.enum";
import { IUpdateUser } from "../dto/req/userReq.dto";
import AppError from "../errors/AppError";
import AccountRepository from "../repositories/account.reposetory";

class AccountService {
  private accountRepository = new AccountRepository();
  //define method
  public updateProfile = async (id: number, dataUser: IUpdateUser) => {
    const user = await this.accountRepository.updateUser(id, dataUser);
    if (!user) {
      throw new AppError(
        "Cannot update profile",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return user;
  };
  public getDataUser = async (id: number) => {
    const user = await this.accountRepository.getDataUser(id);
    if (!user) {
      throw new AppError(ErrorMsg.CANNOT_GET_DATA, StatusCode.NOT_FOUND);
    }
    return user;
  };
}

export default AccountService;
