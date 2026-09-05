import { prisma } from "../../lib/prisma";
import type {
	ICreateLoadSheddingSchedule,
	IUpdateLoadSheddingSchedule,
} from "./loadSheddingSchedule.interface";

const parseDateTime = (dateTime: string): Date => {
	const match = dateTime.match(
		/^(\d{4})\.(\d{2})\.(\d{2}),\s*(\d{1,2})\.(\d{2})\s*(AM|PM)$/i,
	);

	if (!match) {
		throw new Error("Invalid date time format. Use YYYY.MM.DD, HH.MM AM/PM");
	}

	const year = match[1];
	const month = match[2];
	const day = match[3];
	const hour = match[4];
	const minute = match[5];
	const period = match[6];

	if (
		year === undefined ||
		month === undefined ||
		day === undefined ||
		hour === undefined ||
		minute === undefined ||
		period === undefined
	) {
		throw new Error("Invalid date time");
	}

	const monthNumber = Number(month);
	const dayNumber = Number(day);
	let hourNumber = Number(hour);
	const minuteNumber = Number(minute);

	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error("Invalid month");
	}

	if (dayNumber < 1 || dayNumber > 31) {
		throw new Error("Invalid day");
	}

	if (hourNumber < 1 || hourNumber > 12) {
		throw new Error("Invalid hour");
	}

	if (minuteNumber < 0 || minuteNumber > 59) {
		throw new Error("Invalid minute");
	}

	const upperPeriod = period.toUpperCase();

	if (upperPeriod === "PM" && hourNumber !== 12) {
		hourNumber += 12;
	}

	if (upperPeriod === "AM" && hourNumber === 12) {
		hourNumber = 0;
	}

	const result = new Date(
		Number(year),
		monthNumber - 1,
		dayNumber,
		hourNumber,
		minuteNumber,
		0,
		0,
	);

	if (
		result.getFullYear() !== Number(year) ||
		result.getMonth() !== monthNumber - 1 ||
		result.getDate() !== dayNumber
	) {
		throw new Error("Invalid date");
	}

	return result;
};

const formatBangladeshDateTime = (date: Date): string => {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).formatToParts(date);

	const get = (type: string): string => {
		return parts.find((part) => part.type === type)?.value ?? "";
	};

	return `${get("year")}.${get("month")}.${get("day")}, ${get(
		"hour",
	)}.${get("minute")} ${get("dayPeriod")}`;
};

const createLoadSheddingSchedule = async (
	payload: ICreateLoadSheddingSchedule,
) => {
	const { areaId, startTime, endTime, reason, description } = payload;

	const parsedStartTime = parseDateTime(startTime);
	const parsedEndTime = parseDateTime(endTime);

	if (parsedStartTime >= parsedEndTime) {
		throw new Error("End time must be after start time");
	}

	const area = await prisma.area.findUnique({
		where: {
			id: areaId,
		},
	});

	if (!area) {
		throw new Error("Area not found");
	}

	const schedule = await prisma.loadSheddingSchedule.create({
		data: {
			areaId,
			startTime: parsedStartTime,
			endTime: parsedEndTime,
			...(reason !== undefined && { reason }),
			...(description !== undefined && { description }),
		},
	});

	return {
		...schedule,
		startTime: formatBangladeshDateTime(schedule.startTime),
		endTime: formatBangladeshDateTime(schedule.endTime),
	};
};

const getAllLoadSheddingSchedules = async () => {
	const schedules = await prisma.loadSheddingSchedule.findMany({
		include: {
			area: true,
		},
		orderBy: {
			startTime: "asc",
		},
	});

	return schedules.map((schedule) => ({
		...schedule,
		startTime: formatBangladeshDateTime(schedule.startTime),
		endTime: formatBangladeshDateTime(schedule.endTime),
	}));
};

const getSingleLoadSheddingSchedule = async (id: string) => {
	const schedule = await prisma.loadSheddingSchedule.findUnique({
		where: {
			id,
		},
		include: {
			area: true,
		},
	});

	if (!schedule) {
		throw new Error("Load shedding schedule not found");
	}

	return {
		...schedule,
		startTime: formatBangladeshDateTime(schedule.startTime),
		endTime: formatBangladeshDateTime(schedule.endTime),
	};
};

const updateLoadSheddingSchedule = async (
	id: string,
	payload: IUpdateLoadSheddingSchedule,
) => {
	const existingSchedule = await prisma.loadSheddingSchedule.findUnique({
		where: {
			id,
		},
	});

	if (!existingSchedule) {
		throw new Error("Load shedding schedule not found");
	}

	let parsedStartTime = existingSchedule.startTime;
	let parsedEndTime = existingSchedule.endTime;

	if (payload.startTime !== undefined) {
		parsedStartTime = parseDateTime(payload.startTime);
	}

	if (payload.endTime !== undefined) {
		parsedEndTime = parseDateTime(payload.endTime);
	}

	if (parsedStartTime >= parsedEndTime) {
		throw new Error("End time must be after start time");
	}

	if (payload.areaId !== undefined) {
		const area = await prisma.area.findUnique({
			where: {
				id: payload.areaId,
			},
		});

		if (!area) {
			throw new Error("Area not found");
		}
	}

	const schedule = await prisma.loadSheddingSchedule.update({
		where: {
			id,
		},
		data: {
			...(payload.areaId !== undefined && {
				areaId: payload.areaId,
			}),

			...(payload.startTime !== undefined && {
				startTime: parsedStartTime,
			}),

			...(payload.endTime !== undefined && {
				endTime: parsedEndTime,
			}),

			...(payload.reason !== undefined && {
				reason: payload.reason,
			}),

			...(payload.description !== undefined && {
				description: payload.description,
			}),
		},
	});

	return {
		...schedule,
		startTime: formatBangladeshDateTime(schedule.startTime),
		endTime: formatBangladeshDateTime(schedule.endTime),
	};
};

const deleteLoadSheddingSchedule = async (id: string) => {
	const existingSchedule = await prisma.loadSheddingSchedule.findUnique({
		where: {
			id,
		},
	});

	if (!existingSchedule) {
		throw new Error("Load shedding schedule not found");
	}

	const schedule = await prisma.loadSheddingSchedule.delete({
		where: {
			id,
		},
	});

	return schedule;
};

export const loadSheddingScheduleService = {
	createLoadSheddingSchedule,
	getAllLoadSheddingSchedules,
	getSingleLoadSheddingSchedule,
	updateLoadSheddingSchedule,
	deleteLoadSheddingSchedule,
};
