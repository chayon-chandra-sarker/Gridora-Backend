import type { Request, Response } from "express";

import { paymentService } from "./payment.service";
import { createBkashPayment, executeBkashPayment } from "./bkash.service";

import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.createPayment(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Payment created successfully",
		data: result,
	});
});

const getAllPayments = catchAsync(async (_req: Request, res: Response) => {
	const result = await paymentService.getAllPayments();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payments retrieved successfully",
		data: result,
	});
});

// ========================================
// Get Single Payment
// ========================================
const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid payment id");
	}

	const result = await paymentService.getSinglePayment(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment retrieved successfully",
		data: result,
	});
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		throw new AppError(401, "User not authenticated");
	}

	const result = await paymentService.getMyPayments(userId);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Your payments retrieved successfully",
		data: result,
	});
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid payment id");
	}

	const result = await paymentService.updatePayment(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment updated successfully",
		data: result,
	});
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid payment id");
	}

	const result = await paymentService.deletePayment(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment deleted successfully",
		data: result,
	});
});

const createPaymentBkash = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id;

	if (!userId) {
		throw new AppError(401, "User not authenticated");
	}

	const { billId } = req.body;

	if (!billId) {
		throw new AppError(400, "Bill ID is required");
	}

	const result = await createBkashPayment(userId, billId);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "bKash payment created successfully",
		data: result,
	});
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
	const paymentID = req.query.paymentID;
	const status = req.query.status;

	if (typeof paymentID !== "string" || !paymentID) {
		throw new AppError(400, "Invalid bKash payment ID");
	}

	if (typeof status !== "string" || !status) {
		throw new AppError(400, "Invalid bKash payment status");
	}

	if (status === "success") {
		const result = await executeBkashPayment(paymentID);

		return sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "bKash payment executed successfully",
			data: result,
		});
	}

	if (status === "failure") {
		return sendResponse(res, {
			statusCode: 400,
			success: false,
			message: "bKash payment failed",
			data: null,
		});
	}

	if (status === "cancel") {
		return sendResponse(res, {
			statusCode: 400,
			success: false,
			message: "bKash payment cancelled",
			data: null,
		});
	}

	throw new AppError(400, "Invalid bKash payment status");
});

export const paymentController = {
	createPayment,
	getAllPayments,
	getSinglePayment,
	getMyPayments,
	updatePayment,
	deletePayment,
	createPaymentBkash,
	bkashCallback,
};
