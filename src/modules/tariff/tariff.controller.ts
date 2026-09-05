import type { Request, Response } from "express";

import { tariffService } from "./tariff.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createTariff = catchAsync(async (req: Request, res: Response) => {
	const result = await tariffService.createTariff(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Tariff created successfully",
		data: result,
	});
});

const getAllTariffs = catchAsync(async (_req: Request, res: Response) => {
	const result = await tariffService.getAllTariffs();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tariffs retrieved successfully",
		data: result,
	});
});

const getSingleTariff = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new Error("Invalid tariff id");
	}

	const result = await tariffService.getSingleTariff(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tariff retrieved successfully",
		data: result,
	});
});

const getActiveTariffs = catchAsync(async (_req: Request, res: Response) => {
	const result = await tariffService.getActiveTariffs();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Active tariffs retrieved successfully",
		data: result,
	});
});

const updateTariff = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new Error("Invalid tariff id");
	}

	const result = await tariffService.updateTariff(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tariff updated successfully",
		data: result,
	});
});

const deleteTariff = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id || Array.isArray(id)) {
		throw new Error("Invalid tariff id");
	}

	const result = await tariffService.deleteTariff(id);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Tariff deleted successfully",
		data: result,
	});
});

export const tariffController = {
	createTariff,
	getAllTariffs,
	getSingleTariff,
	getActiveTariffs,
	updateTariff,
	deleteTariff,
};
