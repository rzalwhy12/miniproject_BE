import { nanoid } from "nanoid";

//function generate refferalCode
export const generateReferralCode = () => {
  return nanoid(8).toUpperCase();
};
