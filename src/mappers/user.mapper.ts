import { User } from "../../prisma/generated/client";
import { IUserDTO } from "../dto/user/userResponse.dto";

//function unutk reassign user scema ke interface user yang buat dikirim ke FE
export const mapUserToDTO = (user: User): IUserDTO => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    gender: user.gender,
    brithDate: user.brithDate,
  };
};
