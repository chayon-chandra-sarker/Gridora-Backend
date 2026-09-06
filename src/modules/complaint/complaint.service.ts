import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import type { ICreateComplaint, IUpdateComplaint } from "./complaint.interface";

// Safe user fields
const userSelect = {
	id: true,
	name: true,
	email: true,
	phone: true,
	customerNumber: true,
	meterNumber: true,
	address: true,
	role: true,
	isActive: true,
	areaId: true,
	createdAt: true,
	updatedAt: true,
};

// Create complaint
const createComplaint = async (userId: string, payload: ICreateComplaint) => {
	const { title, description } = payload;

	if (!title?.trim()) {
		throw new AppError(400, "Complaint title is required");
	}

	if (!description?.trim()) {
		throw new AppError(400, "Complaint description is required");
	}

	// Check user
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	const complaint = await prisma.complaint.create({
		data: {
			userId,
			title: title.trim(),
			description: description.trim(),
		},

		include: {
			user: {
				select: userSelect,
			},
		},
	});

	return complaint;
};

// Get all complaints
const getAllComplaints = async () => {
	const complaints = await prisma.complaint.findMany({
		include: {
			user: {
				select: userSelect,
			},
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	return complaints;
};

// Get single complaint
const getSingleComplaint = async (id: string) => {
	const complaint = await prisma.complaint.findUnique({
		where: {
			id,
		},

		include: {
			user: {
				select: userSelect,
			},
		},
	});

	if (!complaint) {
		throw new AppError(404, "Complaint not found");
	}

	return complaint;
};

const getMyComplaints = async (userId: string) => {
	const complaints = await prisma.complaint.findMany({
		where: {
			userId,
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	return complaints;
};

const updateComplaint = async (id: string, payload: IUpdateComplaint) => {
	const existingComplaint = await prisma.complaint.findUnique({
		where: {
			id,
		},
	});

	if (!existingComplaint) {
		throw new AppError(404, "Complaint not found");
	}

	if (payload.title !== undefined && !payload.title.trim()) {
		throw new AppError(400, "Complaint title cannot be empty");
	}

	if (payload.description !== undefined && !payload.description.trim()) {
		throw new AppError(400, "Complaint description cannot be empty");
	}

	const complaint = await prisma.complaint.update({
		where: {
			id,
		},

		data: {
			...(payload.title !== undefined && {
				title: payload.title.trim(),
			}),

			...(payload.description !== undefined && {
				description: payload.description.trim(),
			}),

			...(payload.status !== undefined && {
				status: payload.status,
			}),
		},

		include: {
			user: {
				select: userSelect,
			},
		},
	});

	return complaint;
};

const deleteComplaint = async (id: string) => {
	const existingComplaint = await prisma.complaint.findUnique({
		where: {
			id,
		},
	});

	if (!existingComplaint) {
		throw new AppError(404, "Complaint not found");
	}

	const complaint = await prisma.complaint.delete({
		where: {
			id,
		},
	});

	return complaint;
};

export const complaintService = {
	createComplaint,
	getAllComplaints,
	getSingleComplaint,
	getMyComplaints,
	updateComplaint,
	deleteComplaint,
};
