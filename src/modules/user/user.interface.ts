
export interface registerUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: "CUSTOMER" | "OPERATOR" | "ADMIN";
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

