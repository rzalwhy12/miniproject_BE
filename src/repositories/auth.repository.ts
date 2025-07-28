import { prisma } from "../config/prisma";
import { IIsExist, ISignUpDTO } from "../dto/user/user.Request.dto.";
import { generateReferralCode } from "../utils/generateReferralCode";
import { hashPassword } from "../utils/hash";

//repocitories yang berhubungan dengan database
class AuthRepository {
  public createUser = async (dataSignUp: ISignUpDTO) => {
    return await prisma.user.create({
      data: {
        ...dataSignUp,
        password: await hashPassword(dataSignUp.password),
        referralCode: await generateReferralCode(),
      },
    });
  };
  public findAccount = async (dataLogin: IIsExist) => {
    const { email, username } = dataLogin;
    if (email) {
      return await prisma.user.findUnique({ where: { email } });
    }

    if (username) {
      return await prisma.user.findUnique({ where: { username } });
    }

    return null;
  };
}

export default AuthRepository;
