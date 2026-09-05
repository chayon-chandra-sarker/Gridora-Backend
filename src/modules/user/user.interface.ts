import type { UserRole } from "../../../generated/prisma/enums";

export interface registerUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  customerNumber?: string;
  meterNumber?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
  customerNumber?: string;
  meterNumber?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?:  string;
  customerNumber?: string;
  meterNumber?: string;
  role?: UserRole ;
  isActive?: boolean;
  areaId?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}