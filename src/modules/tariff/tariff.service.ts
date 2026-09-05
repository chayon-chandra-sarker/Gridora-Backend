import { prisma } from "../../lib/prisma";

import type { ICreateTariff, IUpdateTariff } from "./tariff.interface";

const createTariff = async (payload: ICreateTariff) => {
	const { minUnit, maxUnit, pricePerUnit, isActive = true } = payload;

	// Validate units
	if (minUnit < 0) {
		throw new Error("Minimum unit cannot be negative");
	}

	if (maxUnit !== undefined && maxUnit !== null) {
		if (maxUnit < 0) {
			throw new Error("Maximum unit cannot be negative");
		}

		if (maxUnit < minUnit) {
			throw new Error(
				"Maximum unit must be greater than or equal to minimum unit",
			);
		}
	}

	// Validate price
	if (pricePerUnit < 0) {
		throw new Error("Price per unit cannot be negative");
	}

	// Check overlapping tariff range
	const overlappingTariff = await prisma.tariff.findFirst({
		where: {
			AND: [
				{
					minUnit: {
						lte: maxUnit ?? 2147483647,
					},
				},
				{
					OR: [
						{
							maxUnit: null,
						},
						{
							maxUnit: {
								gte: minUnit,
							},
						},
					],
				},
			],
		},
	});

	if (overlappingTariff) {
		throw new Error("Tariff unit range overlaps with an existing tariff");
	}

	const tariff = await prisma.tariff.create({
		data: {
			minUnit,
			...(maxUnit !== undefined && {
				maxUnit,
			}),
			pricePerUnit,
			isActive,
		},
	});

	return tariff;
};

const getAllTariffs = async () => {
	const tariffs = await prisma.tariff.findMany({
		orderBy: {
			minUnit: "asc",
		},
	});

	return tariffs;
};

const getSingleTariff = async (id: string) => {
	const tariff = await prisma.tariff.findUnique({
		where: {
			id,
		},
	});

	if (!tariff) {
		throw new Error("Tariff not found");
	}

	return tariff;
};

const getActiveTariffs = async () => {
	const tariffs = await prisma.tariff.findMany({
		where: {
			isActive: true,
		},
		orderBy: {
			minUnit: "asc",
		},
	});

	return tariffs;
};

const updateTariff = async (id: string, payload: IUpdateTariff) => {
	const existingTariff = await prisma.tariff.findUnique({
		where: {
			id,
		},
	});

	if (!existingTariff) {
		throw new Error("Tariff not found");
	}

	const minUnit = payload.minUnit ?? existingTariff.minUnit;

	const maxUnit =
		payload.maxUnit !== undefined ? payload.maxUnit : existingTariff.maxUnit;

	const pricePerUnit =
		payload.pricePerUnit ?? Number(existingTariff.pricePerUnit);

	// Validate units
	if (minUnit < 0) {
		throw new Error("Minimum unit cannot be negative");
	}

	if (maxUnit !== null && maxUnit !== undefined) {
		if (maxUnit < 0) {
			throw new Error("Maximum unit cannot be negative");
		}

		if (maxUnit < minUnit) {
			throw new Error(
				"Maximum unit must be greater than or equal to minimum unit",
			);
		}
	}

	// Validate price
	if (pricePerUnit < 0) {
		throw new Error("Price per unit cannot be negative");
	}

	// Check overlapping tariff range
	const overlappingTariff = await prisma.tariff.findFirst({
		where: {
			id: {
				not: id,
			},
			AND: [
				{
					minUnit: {
						lte: maxUnit ?? 2147483647,
					},
				},
				{
					OR: [
						{
							maxUnit: null,
						},
						{
							maxUnit: {
								gte: minUnit,
							},
						},
					],
				},
			],
		},
	});

	if (overlappingTariff) {
		throw new Error("Tariff unit range overlaps with an existing tariff");
	}

	const tariff = await prisma.tariff.update({
		where: {
			id,
		},
		data: {
			...(payload.minUnit !== undefined && {
				minUnit: payload.minUnit,
			}),

			...(payload.maxUnit !== undefined && {
				maxUnit: payload.maxUnit,
			}),

			...(payload.pricePerUnit !== undefined && {
				pricePerUnit: payload.pricePerUnit,
			}),

			...(payload.isActive !== undefined && {
				isActive: payload.isActive,
			}),
		},
	});

	return tariff;
};

const deleteTariff = async (id: string) => {
	const existingTariff = await prisma.tariff.findUnique({
		where: {
			id,
		},
	});

	if (!existingTariff) {
		throw new Error("Tariff not found");
	}

	const tariff = await prisma.tariff.delete({
		where: {
			id,
		},
	});

	return tariff;
};

export const tariffService = {
	createTariff,
	getAllTariffs,
	getSingleTariff,
	getActiveTariffs,
	updateTariff,
	deleteTariff,
};
