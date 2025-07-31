import { User } from "../../prisma/generated/client";

//function unutk reassign user scema ke interface user yang buat dikirim ke FE
export const mapUserToDTO = (user: User) => {
  return {
    name: user.name,
    email: user.name,
    noTlp: user.noTlp,
    birthDate: user.birthDate,
    gender: user.gender,
    profileImage: user.profileImage,
    username: user.username,
  };
};
