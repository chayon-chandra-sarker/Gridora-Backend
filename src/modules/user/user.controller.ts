import type { Request, Response } from "express";
import httpStatus from "http-status";

import { userService } from "./user.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
	const result = await userService.updateMyProfileIntoDB(
		req.user!.id,
		req.body,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Profile updated successfully",
		data: result,
	});
});

const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
	const result = await userService.getAllUsersFromDB();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Users retrieved successfully",
		data: result,
	});
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await userService.updateUserIntoDB(id as string, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "User updated successfully",
		data: result,
	});
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { role } = req.body;

	const result = await userService.updateUserRoleIntoDB(id as string, role);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User role updated successfully",
		data: result,
	});
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { isActive } = req.body;

	const result = await userService.updateUserStatusIntoDB(
		id as string,
		isActive,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User status updated successfully",
		data: result,
	});
});

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.id;

	if (!req.file) {
		return res.status(httpStatus.BAD_REQUEST).json({
			success: false,
			message: "Please upload an image",
		});
	}

	const result = await userService.uploadProfileImage(userId, req.file);

	return res.status(httpStatus.OK).json({
		success: true,
		message: "Profile image uploaded successfully",
		data: result,
	});
});

export const userController = {
	updateMyProfile,
	getAllUsers,
	updateUser,
	updateUserRole,
	updateUserStatus,
	uploadProfileImage,
};
