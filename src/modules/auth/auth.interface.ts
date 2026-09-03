
import type { Request } from "express";
import type { UserRole } from "../../../generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  customerNumber?: string;
  meterNumber?: string;
  address?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

