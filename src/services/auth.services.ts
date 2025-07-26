import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { generateReferralCode } from "../utils/generateReferralCode";
import { IUserSignUpDTO } from "../dto/user/user.Request.dto.";

class AuthServices {
  public signUp = async (dataSignUp: IUserSignUpDTO) => {
    const newUser = await prisma.user.create({
      data: {
        ...dataSignUp,
        password: await hashPassword(dataSignUp.password),
        referralCode: generateReferralCode(),
      },
    });
    return newUser;
  };
  //live isexist email dan username service
  public isEmailExist = async (email: string) => {
    const isExist: boolean =
      (await prisma.user.findUnique({
        where: {
          email,
        },
      })) !== null;
    return isExist;
  };

  public isUsernameExist = async (username: string) => {
    const isExist: boolean =
      (await prisma.user.findUnique({
        where: {
          username,
        },
      })) !== null;

    return isExist;
  };
}

export default AuthServices;
