import { Gender } from "../../../prisma/generated/client";

export interface ISignUpDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: Gender;
}

export interface IIsExist {
  email?: string;
  username?: string;
}
