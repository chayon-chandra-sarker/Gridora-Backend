import bcrypt from "bcrypt";
import httpStatus from "http-status";
import type { UserRole } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import type { UpdateProfilePayload, UpdateUserPayload } from "./user.interface";

import { sendOTPEmail } from "../../utils/email";
import cloudinary from "../../config/cloudinary";

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
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updateData: Record<string, unknown> = {};

  // Name
  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  // Phone
  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  // Address
  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  // Customer Number
  if (payload.customerNumber !== undefined) {
    const customerNumberExist = await prisma.user.findUnique({
      where: {
        customerNumber: payload.customerNumber,
      },
    });

    if (customerNumberExist && customerNumberExist.id !== userId) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This customer number is already in use",
      );
    }

    updateData.customerNumber = payload.customerNumber;
  }

  // Meter Number
  if (payload.meterNumber !== undefined) {
    const meterNumberExist = await prisma.user.findUnique({
      where: {
        meterNumber: payload.meterNumber,
      },
    });

    if (meterNumberExist && meterNumberExist.id !== userId) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This meter number is already in use",
      );
    }

    updateData.meterNumber = payload.meterNumber;
  }

  // Update User
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

const updateUserIntoDB = async (id: string, payload: UpdateUserPayload) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updateData: Record<string, unknown> = {};

  // Name
  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  // Email
  if (payload.email !== undefined) {
    const emailExist = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (emailExist && emailExist.id !== id) {
      throw new AppError(httpStatus.CONFLICT, "This email is already in use");
    }

    updateData.email = payload.email;
  }

  // Phone
  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }

  // Address
  if (payload.address !== undefined) {
    updateData.address = payload.address;
  }

  // Customer Number
  if (payload.customerNumber !== undefined) {
    const customerNumberExist = await prisma.user.findUnique({
      where: {
        customerNumber: payload.customerNumber,
      },
    });

    if (customerNumberExist && customerNumberExist.id !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This customer number is already in use",
      );
    }

    updateData.customerNumber = payload.customerNumber;
  }

  // Meter Number
  if (payload.meterNumber !== undefined) {
    const meterNumberExist = await prisma.user.findUnique({
      where: {
        meterNumber: payload.meterNumber,
      },
    });

    if (meterNumberExist && meterNumberExist.id !== id) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This meter number is already in use",
      );
    }

    updateData.meterNumber = payload.meterNumber;
  }

  // Role
  if (payload.role !== undefined) {
    updateData.role = payload.role;
  }

  // Active Status
  if (payload.isActive !== undefined) {
    updateData.isActive = payload.isActive;
  }

  // Area
  if (payload.areaId !== undefined) {
    updateData.areaId = payload.areaId;
  }

  // Update User
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

const updateUserRoleIntoDB = async (id: string, role: UserRole) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
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
      customerNumber: true,
      meterNumber: true,
      address: true,
      areaId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

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

const updateUserStatusIntoDB = async (id: string, isActive: boolean) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Prevent deactivating ADMIN
  if (isUserExist.role === "ADMIN" && isActive === false) {
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
      customerNumber: true,
      meterNumber: true,
      address: true,
      areaId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const uploadProfileImage = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gridora/profile-images",
        public_id: `user-${userId}`,
        overwrite: true,
        resource_type: "image",
      },
      (error: Error | undefined, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(file.buffer);
  });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: uploadResult.secure_url,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
    },
  });

  return updatedUser;
};

export const userService = {
  updateMyProfileIntoDB,
  updateUserIntoDB,
  updateUserRoleIntoDB,
  getAllUsersFromDB,
  updateUserStatusIntoDB,
  uploadProfileImage,
};
