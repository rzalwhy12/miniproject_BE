import { prisma } from "../config/prisma";
import {
  IDataCoupon,
  IDataPoint,
  IDataReferral,
  IFindAccount,
  ISignUpDTO,
  IUpdateUser,
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
  public addRole = async (userId: number, roleId: number) => {
    return await prisma.userRole.create({
      data: {
        userId,
        roleId, //default role 2 yaitu customer
      },
    });
  };
  public findAccount = async (dataFindUnique: IFindAccount) => {
    const { id, email, username, referral } = dataFindUnique;
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
    if (id) {
      return await prisma.user.findUnique({
        where: { id },
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
  public updateUser = async (dataUser: IUpdateUser) => {
    return await prisma.user.update({
      where: {
        id: dataUser.id,
      },
      data: { ...dataUser },
    });
  };
  public resetPassword = async (id: number, password: string) => {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  };
}

export default AuthRepository;
