import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/hash";
import { generateReferralCode } from "../utils/generateReferralCode";
import { ISignUpInput } from "../types/signUp.type";

class AuthServices {
  public signUp = async (dataSignUp: ISignUpInput) => {
    const newUser = await prisma.user.create({
      data: {
        ...dataSignUp,
        password: await hashPassword(dataSignUp.password),
        referralCode: generateReferralCode(),
      },
    });
    return newUser;
  };
}

export default AuthServices;
