import { prisma } from "../config/prisma";
import { IUpdateUser } from "../dto/req/userReq.dto";

class AccountRepository {
  public getDataUser = async (id: number) => {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  };
  public updateUser = async (id: number, dataUser: IUpdateUser) => {
    return await prisma.user.update({
      where: {
        id,
      },
      data: { ...dataUser },
    });
  };
}

export default AccountRepository;
