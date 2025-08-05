import { prisma } from "../config/prisma";
import { IUpdateUser } from "../dto/req/userReq.dto";
import { hashPassword } from "../utils/hash";

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
  public getUserCoupon = async (userId: number) => {
    const referral = await prisma.referral.findUnique({
      where: { referredId: userId },
      include: { coupon: true },
    });

    if (
      referral?.coupon &&
      referral.coupon.isUsed === false &&
      referral.coupon.usedTemporarily === false &&
      referral.coupon.expiresAt > new Date()
    ) {
      const { discount, expiresAt } = referral.coupon;
      return { discount, expiresAt };
    }

    return null;
  };
  public getPoint = async (userId: number) => {
    const result = await prisma.point.aggregate({
      where: {
        userId,
        isUsed: false,
        usedTemporarily: false,
        expiresAt: { gt: new Date() },
      },
      _sum: { amount: true },
    });

    const soonestPoint = await prisma.point.findFirst({
      where: {
        userId,
        isUsed: false,
        usedTemporarily: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        expiresAt: "asc",
      },
      select: {
        expiresAt: true,
      },
    });

    return {
      totalPoint: result._sum.amount || 0,
      soonestExpiry: soonestPoint?.expiresAt || null,
    };
  };
  public newPassword = async (userId: number, newPassword: string) => {
    return await prisma.user.update({
      where: { id: userId },
      data: { password: await hashPassword(newPassword) },
    });
  };
}

export default AccountRepository;
