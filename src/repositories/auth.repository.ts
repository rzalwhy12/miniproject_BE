import { prisma } from "../config/prisma";
import {
  IDataCoupon,
  IDataPoint,
  IDataReferral,
  IFindAccount,
  ISignUpDTO,
} from "../dto/user/user.Request.dto.";
import { generateReferralCode } from "../utils/generateReferralCode";
import { hashPassword } from "../utils/hash";

//repocitosreies yang berhubungan dengan database
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
  public findAccount = async (dataFindUnique: IFindAccount) => {
    const { email, username, referral } = dataFindUnique;
    if (email) {
      return await prisma.user.findUnique({ where: { email } });
    }

    if (username) {
      return await prisma.user.findUnique({ where: { username } });
    }

    if (referral) {
      return await prisma.user.findUnique({
        where: { referralCode: referral },
      });
    }

    return null;
  };
  public AddReferral = async (dataReferal: IDataReferral) => {
    return await prisma.referral.create({
      data: {
        ...dataReferal,
      },
      include: {
        coupon: true,
      },
    });
  };
  public AddCoupon = async (dataCoupon: IDataCoupon) => {
    return await prisma.coupon.create({
      data: {
        ...dataCoupon,
      },
    });
  };
  public AddPoint = async (dataPoint: IDataPoint) => {
    return await prisma.point.create({
      data: {
        ...dataPoint,
      },
    });
  };
}

export default AuthRepository;
