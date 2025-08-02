import { RoleName } from "../../prisma/generated/client";
import { prisma } from "../config/prisma";
import {
  IDataCoupon,
  IDataPoint,
  IDataReferral,
  IFindAccount,
  ISignUpDTO,
  IUpdateUser,
} from "../dto/req/userReq.dto";
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
  public addRole = async (userId: number) => {
    const roles = await prisma.role.findMany({
      where: {
        name: { in: [RoleName.CUSTOMER, RoleName.ORGANIZER] },
      },
    });

    const customer = roles.find((r) => r.name === RoleName.CUSTOMER);
    const organizer = roles.find((r) => r.name === RoleName.ORGANIZER);

    if (!customer || !organizer) {
      throw new Error("Roles not found");
    }

    return await prisma.userRole.createMany({
      data: [
        { userId, roleId: customer.id, isActive: true },
        { userId, roleId: organizer.id, isActive: false },
      ],
    });
  };

  public findAccount = async (dataFindUnique: IFindAccount) => {
    const { id, email, username, referral } = dataFindUnique;

    if (email) {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          roles: { include: { role: true } },
        },
      });
    }

    if (username) {
      return await prisma.user.findUnique({
        where: { username },
        include: {
          roles: { include: { role: true } },
        },
      });
    }

    if (referral) {
      return await prisma.user.findUnique({
        where: { referralCode: referral },
        include: {
          roles: { include: { role: true } },
        },
      });
    }

    if (id) {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          roles: { include: { role: true } },
        },
      });
    }

    return null;
  };

  public addReferral = async (dataReferal: IDataReferral) => {
    return await prisma.referral.create({
      data: {
        ...dataReferal,
      },
      include: {
        coupon: true,
      },
    });
  };
  public addCoupon = async (dataCoupon: IDataCoupon) => {
    return await prisma.coupon.create({
      data: {
        ...dataCoupon,
      },
    });
  };
  public addPoint = async (dataPoint: IDataPoint) => {
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
        password: await hashPassword(password),
      },
    });
  };
  public switchRoleRepo = async (userId: number, targetRoleId: number) => {
    // 1. Set semua role user jadi tidak aktif
    await prisma.userRole.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // 2. Aktifkan role yang dipilih
    await prisma.userRole.updateMany({
      where: { userId, roleId: targetRoleId },
      data: { isActive: true },
    });

    // 3. Ambil role aktif
    const activeRole = await prisma.userRole.findFirst({
      where: { userId, isActive: true },
      include: { role: true },
    });

    // 4. Return hanya nama role
    return activeRole?.role.name;
  };
  public activeRole = async (userId: number) => {
    const active = await prisma.userRole.findFirst({
      where: { userId, isActive: true },
      include: { role: true },
    });
    return active?.role.name;
  };
}

export default AuthRepository;
