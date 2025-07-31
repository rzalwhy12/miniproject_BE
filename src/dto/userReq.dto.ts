import { Gender } from "../../prisma/generated/client";

export interface ISignUpDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  referralCode: string;
}

export interface IFindAccount {
  id?: number;
  email?: string;
  username?: string;
  referral?: string;
}
export interface IDataReferral {
  referrerId: number;
  referredId: number;
}
export interface IDataCoupon {
  discount: number;
  expiresAt: Date;
  referralId: number;
  isUsed?: boolean;
  useAt?: Date;
}

export interface IDataPoint {
  userId: number;
  isUsed?: boolean;
  amount: number;
  expiresAt: Date;
}

export interface IUpdateUser {
  id: number;
  noTlp?: string;
  birthDate?: string;
  gender?: Gender;
  profileImage?: string;
}
