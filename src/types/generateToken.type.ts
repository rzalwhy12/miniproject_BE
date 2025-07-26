import { Role } from "../../prisma/generated/client";

//interface buat generatetoken
export interface IObjectToken {
  id: string;
  role: Role;
  isverified: boolean;
}
