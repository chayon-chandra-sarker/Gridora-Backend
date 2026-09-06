import type { Request, Response } from "express";

import { complaintService } from "./complaint.service";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createComplaint = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		throw new AppError(401, "User not authenticated");
	}

	const result = await complaintService.createComplaint(userId, req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Complaint created successfully",
		data: result,
	});
});

const getAllComplaints = catchAsync(async (_req: Request, res: Response) => {
	const result = await complaintService.getAllComplaints();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Complaints retrieved successfully",
		data: result,
	});
});

const getSingleComplaint = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid complaint id");
	}

	const result = await complaintService.getSingleComplaint(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Complaint retrieved successfully",
		data: result,
	});
});

const getMyComplaints = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		throw new AppError(401, "User not authenticated");
	}

	const result = await complaintService.getMyComplaints(userId);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Your complaints retrieved successfully",
		data: result,
	});
});

const updateComplaint = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid complaint id");
	}

	const result = await complaintService.updateComplaint(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Complaint updated successfully",
		data: result,
	});
});

const deleteComplaint = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid complaint id");
	}

	const result = await complaintService.deleteComplaint(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Complaint deleted successfully",
		data: result,
	});
});

export const complaintController = {
	createComplaint,
	getAllComplaints,
	getSingleComplaint,
	getMyComplaints,
	updateComplaint,
	deleteComplaint,
};