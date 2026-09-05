import { prisma } from "../../lib/prisma";
import type { ICreateArea, IUpdateArea } from "./area.interface";

const createArea = async (payload: ICreateArea) => {
	const { name, city, district } = payload;

	const existingArea = await prisma.area.findFirst({
		where: {
			name,
			city,
			district,
		},
	});

	if (existingArea) {
		throw new Error("Area already exists");
	}

	const area = await prisma.area.create({
		data: {
			name,
			city,
			district,
		},
	});

	return area;
};

const getAllAreas = async () => {
	const areas = await prisma.area.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return areas;
};

const getSingleArea = async (id: string) => {
	const area = await prisma.area.findUnique({
		where: {
			id,
		},
	});

	if (!area) {
		throw new Error("Area not found");
	}

	return area;
};

const updateArea = async (id: string, payload: IUpdateArea) => {
	const existingArea = await prisma.area.findUnique({
		where: {
			id,
		},
	});

	if (!existingArea) {
		throw new Error("Area not found");
	}

	const area = await prisma.area.update({
		where: {
			id,
		},
		data: payload,
	});

	return area;
};

const deleteArea = async (id: string) => {
	const existingArea = await prisma.area.findUnique({
		where: {
			id,
		},
	});

	if (!existingArea) {
		throw new Error("Area not found");
	}

	const area = await prisma.area.delete({
		where: {
			id,
		},
	});

	return area;
};

export const areaService = {
	createArea,
	getAllAreas,
	getSingleArea,
	updateArea,
	deleteArea,
};
