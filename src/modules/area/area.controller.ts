import type { Request, Response } from "express";

import { areaService } from "./area.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errors/AppError";

const createArea = catchAsync(async (req: Request, res: Response) => {
	const result = await areaService.createArea(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Area created successfully",
		data: result,
	});
});

const getAllAreas = catchAsync(async (_req: Request, res: Response) => {
	const result = await areaService.getAllAreas();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Areas retrieved successfully",
		data: result,
	});
});

const getSingleArea = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid area id");
	}

	const result = await areaService.getSingleArea(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Area retrieved successfully",
		data: result,
	});
});

const updateArea = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid area id");
	}

	const result = await areaService.updateArea(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Area updated successfully",
		data: result,
	});
});

const deleteArea = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new AppError(400, "Invalid area id");
	}

	const result = await areaService.deleteArea(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Area deleted successfully",
		data: result,
	});
});

export const areaController = {
	createArea,
	getAllAreas,
	getSingleArea,
	updateArea,
	deleteArea,
};
