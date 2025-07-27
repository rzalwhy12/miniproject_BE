import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { generateReferralCode } from "../utils/generateReferralCode";
import { ILoginDTO, ISignUpDTO } from "../dto/user/user.Request.dto.";
import { User } from "../../prisma/generated/client";

class AuthServices {
  public signUp = async (dataSignUp: ISignUpDTO) => {
    const newUser = await prisma.user.create({
      data: {
        ...dataSignUp,
        password: await hashPassword(dataSignUp.password),
        referralCode: await generateReferralCode(),
      },
    });
    return newUser;
  };

  //live isexist email dan username service
  public isEmailExist = async (email: string) => {
    const isExist: boolean = !!(await prisma.user.findUnique({
      where: {
        email,
      },
    }));
    return isExist;
  };

  public isUsernameExist = async (username: string) => {
    const isExist: boolean = !!(await prisma.user.findUnique({
      where: {
        username,
      },
    }));

    return isExist;
  };

  public loginUser = async (dataLogin: ILoginDTO) => {
    const { username, email, password } = dataLogin;
    let user: User;
    if (username) {
      user = (await prisma.user.findUnique({
        where: {
          username,
        },
      })) as User;
      return user;
    } else if (email) {
      user = (await prisma.user.findUnique({
        where: {
          email,
        },
      })) as User;
      return user;
    }
  };

  public verifyUser = async (id: string) => {
    const isVerify = !!(await prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
      },
    }));
    return isVerify;
  };
}

export default AuthServices;
