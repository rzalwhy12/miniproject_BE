import { Gender } from "../../../prisma/generated/client";

export interface IUserSignUpDTO {
  name: string;
  username: string;
  email: string;
  password: string;
  brithDate: Date;
  gender: Gender;
}
