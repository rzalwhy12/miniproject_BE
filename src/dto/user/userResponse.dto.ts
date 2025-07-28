import { Gender } from "../../../prisma/generated/client";

export interface IUserDTO {
  name: string;
  username: string;
  profileImage: string | null;
  gender: Gender;
  birthDate: Date;
}
