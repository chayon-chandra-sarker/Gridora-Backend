import type { BillStatus } from "../../../generated/prisma/enums";

export interface ICreateBill {
	userId: string;
	billingMonth: string;
	meterNumber: string;
	previousReading: number;
	currentReading: number;
	dueDate: string;
}

export interface IUpdateBill {
	userId?: string;
	billingMonth?: string;
	meterNumber?: string;
	previousReading?: number;
	currentReading?: number;
	dueDate?: string;
	status?: BillStatus;
}
