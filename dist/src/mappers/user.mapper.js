"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserToRes = void 0;
const mapUserToRes = (user, couponDiscount = null, expireCoupon = null, totalPoint = 0, expirePoint = null) => ({
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
exports.mapUserToRes = mapUserToRes;
