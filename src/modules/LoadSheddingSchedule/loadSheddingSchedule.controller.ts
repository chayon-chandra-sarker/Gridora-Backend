import type { Request, Response } from "express";

import { loadSheddingScheduleService } from "./loadSheddingSchedule.service";
import AppError from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createLoadSheddingSchedule = catchAsync(
	async (req: Request, res: Response) => {
		const result =
			await loadSheddingScheduleService.createLoadSheddingSchedule(
				req.body,
			);

		sendResponse(res, {
			statusCode: 201,
			success: true,
			message: "Load shedding schedule created successfully",
			data: result,
		});
	},
);

const getAllLoadSheddingSchedules = catchAsync(
	async (_req: Request, res: Response) => {
		const result =
			await loadSheddingScheduleService.getAllLoadSheddingSchedules();

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Load shedding schedules retrieved successfully",
			data: result,
		});
	},
);

const getSingleLoadSheddingSchedule = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id || Array.isArray(id)) {
			throw new AppError(400, "Invalid schedule id");
		}

		const result =
			await loadSheddingScheduleService.getSingleLoadSheddingSchedule(id);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Load shedding schedule retrieved successfully",
			data: result,
		});
	},
);

const updateLoadSheddingSchedule = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id || Array.isArray(id)) {
			throw new AppError(400, "Invalid schedule id");
		}

		const result =
			await loadSheddingScheduleService.updateLoadSheddingSchedule(
				id,
				req.body,
			);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Load shedding schedule updated successfully",
			data: result,
		});
	},
);

const deleteLoadSheddingSchedule = catchAsync(
	async (req: Request, res: Response) => {
		const { id } = req.params;

		if (!id || Array.isArray(id)) {
			throw new AppError(400, "Invalid schedule id");
		}

		const result =
			await loadSheddingScheduleService.deleteLoadSheddingSchedule(id);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Load shedding schedule deleted successfully",
			data: result,
		});
	},
);

export const loadSheddingScheduleController = {
	createLoadSheddingSchedule,
	getAllLoadSheddingSchedules,
	getSingleLoadSheddingSchedule,
	updateLoadSheddingSchedule,
	deleteLoadSheddingSchedule,
};