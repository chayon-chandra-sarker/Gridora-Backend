
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import type { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import type {
  UpdateProfilePayload,
  UpdateUserPayload,
} from "./user.interface";
import { sendOTPEmail } from "../../utils/email";

// Update My Profile
const updateMyProfileIntoDB = async (
  userId: string,
  payload: UpdateProfilePayload,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  const updateData: Record<string, unknown> = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      customerNumber: true,
      meterNumber: true,
      address: true,
      areaId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Admin: Update User
const updateUserIntoDB = async (
  id: string,
  payload: UpdateUserPayload,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  const updateData: Record<string, unknown> = {};

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.email !== undefined) {
    const emailExist = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (emailExist && emailExist.id !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This email is already in use",
      );
    }

    updateData.email = payload.email;
  }

  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  if (payload.role !== undefined) {
    updateData.role = payload.role;
  }

  if (payload.isActive !== undefined) {
    updateData.isActive = payload.isActive;
  }

  if (payload.areaId !== undefined) {
    updateData.areaId = payload.areaId;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      customerNumber: true,
      meterNumber: true,
      address: true,
      areaId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// Admin: Update User Role
const updateUserRoleIntoDB = async (
  id: string,
  role: UserRole,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Admin: Get All Users
const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      customerNumber: true,
      meterNumber: true,
      address: true,
      areaId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Admin: Update User Status
const updateUserStatusIntoDB = async (
  id: string,
  isActive: boolean,
) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  // Prevent deactivating an ADMIN account
  if (
    isUserExist.role === "ADMIN" &&
    isActive === false
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Admin account cannot be deactivated.",
    );
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      phone: true,
      address: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(404, "User not found.");
  }

 
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  
  const hashedOTP = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await prisma.passwordReset.updateMany({
    where: {
      email,
      used: false,
    },
    data: {
      used: true,
    },
  });

  
  await prisma.passwordReset.create({
    data: {
      email,
      otp: hashedOTP,
      expiresAt,
    },
  });


  await sendOTPEmail(email, otp);

  return {
    email,
    message: "OTP sent successfully. OTP will expire in 2 minutes.",
  };
};

export const userService = {
  updateMyProfileIntoDB,
  updateUserIntoDB,
  updateUserRoleIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  forgotPassword,
};

