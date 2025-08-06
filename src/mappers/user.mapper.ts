import { User } from "../../prisma/generated/client";

export const mapUserToRes = (
  user: User,
  couponDiscount: number | null = null,
  expireCoupon: Date | null = null,
  totalPoint: number = 0,
  expirePoint: Date | null = null
) => ({
  name: user.name,
  email: user.email,
  username: user.username,
  profileImage: user.profileImage,
  noTlp: user.noTlp,
  birthDate: user.birthDate,
  gender: user.gender,
  bankName: user.bankName,
  bankAccount: user.bankAccount,
  accountHolder: user.accountHolder,
  referralCode: user.referralCode,
  isVerified: user.isVerified,
  couponDiscount,
  expireCoupon,
  totalPoint,
  expirePoint,
});
