import { Gender } from "../../prisma/generated/client";

export interface ISignUpInput {
  name: string;
  username: string;
  email: string;
  password: string;
  noTlp: string;
  brithDate: Date;
  gender: Gender;
}
