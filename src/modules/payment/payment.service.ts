import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

import type { ICreatePayment, IUpdatePayment } from "./payment.interface";

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

const createPayment = async (payload: ICreatePayment) => {
	const { userId, billId, amount, method, transactionId, paymentId } = payload;

	if (amount <= 0) {
		throw new AppError(400, "Payment amount must be greater than 0");
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	const bill = await prisma.bill.findUnique({
		where: {
			id: billId,
		},
	});

	if (!bill) {
		throw new AppError(404, "Bill not found");
	}

	if (bill.userId !== userId) {
		throw new AppError(403, "This bill does not belong to this user");
	}

	if (bill.status === "PAID") {
		throw new AppError(409, "This bill has already been paid");
	}

	if (Number(bill.amount) !== amount) {
		throw new AppError(400, "Payment amount must match the bill amount");
	}

	const existingPayment = await prisma.payment.findFirst({
		where: {
			billId,
			status: {
				in: ["PENDING", "SUCCESS"],
			},
		},
	});

	if (existingPayment) {
		throw new AppError(409, "A payment already exists for this bill");
	}

	if (transactionId) {
		const existingTransaction = await prisma.payment.findUnique({
			where: {
				transactionId,
			},
		});

		if (existingTransaction) {
			throw new AppError(409, "Transaction ID already exists");
		}
	}

	if (paymentId) {
		const existingPaymentId = await prisma.payment.findUnique({
			where: {
				paymentId,
			},
		});

		if (existingPaymentId) {
			throw new AppError(409, "Payment ID already exists");
		}
	}

	const payment = await prisma.payment.create({
		data: {
			userId,
			billId,
			amount,
			method: method ?? "BKASH",
			status: "PENDING",

			...(transactionId !== undefined && {
				transactionId,
			}),

			...(paymentId !== undefined && {
				paymentId,
			}),
		},

		include: {
			user: {
				select: userSelect,
			},

			bill: true,
		},
	});

	return payment;
};

const getAllPayments = async () => {
	const payments = await prisma.payment.findMany({
		include: {
			user: {
				select: userSelect,
			},

			bill: true,
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	return payments;
};

const getSinglePayment = async (id: string) => {
	const payment = await prisma.payment.findUnique({
		where: {
			id,
		},

		include: {
			user: {
				select: userSelect,
			},

			bill: true,
		},
	});

	if (!payment) {
		throw new AppError(404, "Payment not found");
	}

	return payment;
};

const getMyPayments = async (userId: string) => {
	const payments = await prisma.payment.findMany({
		where: {
			userId,
		},

		include: {
			bill: true,
		},

		orderBy: {
			createdAt: "desc",
		},
	});

	return payments;
};

const updatePayment = async (id: string, payload: IUpdatePayment) => {
	const existingPayment = await prisma.payment.findUnique({
		where: {
			id,
		},

		include: {
			bill: true,
		},
	});

	if (!existingPayment) {
		throw new AppError(404, "Payment not found");
	}

	if (payload.amount !== undefined && payload.amount <= 0) {
		throw new AppError(400, "Payment amount must be greater than 0");
	}

	if (
		payload.amount !== undefined &&
		payload.amount !== Number(existingPayment.bill.amount)
	) {
		throw new AppError(400, "Payment amount must match the bill amount");
	}

	if (
		payload.transactionId !== undefined &&
		payload.transactionId !== existingPayment.transactionId
	) {
		const existingTransaction = await prisma.payment.findUnique({
			where: {
				transactionId: payload.transactionId,
			},
		});

		if (existingTransaction) {
			throw new AppError(409, "Transaction ID already exists");
		}
	}

	if (
		payload.paymentId !== undefined &&
		payload.paymentId !== existingPayment.paymentId
	) {
		const existingPaymentId = await prisma.payment.findUnique({
			where: {
				paymentId: payload.paymentId,
			},
		});

		if (existingPaymentId) {
			throw new AppError(409, "Payment ID already exists");
		}
	}

	const newStatus = payload.status ?? existingPayment.status;

	const result = await prisma.$transaction(async (tx) => {
		const payment = await tx.payment.update({
			where: {
				id,
			},

			data: {
				...(payload.amount !== undefined && {
					amount: payload.amount,
				}),

				...(payload.method !== undefined && {
					method: payload.method,
				}),

				...(payload.status !== undefined && {
					status: payload.status,
				}),

				...(payload.transactionId !== undefined && {
					transactionId: payload.transactionId,
				}),

				...(payload.paymentId !== undefined && {
					paymentId: payload.paymentId,
				}),
			},

			include: {
				user: {
					select: userSelect,
				},

				bill: true,
			},
		});

		if (newStatus === "SUCCESS") {
			await tx.bill.update({
				where: {
					id: existingPayment.billId,
				},

				data: {
					status: "PAID",
				},
			});
		}

		if (newStatus === "FAILED" || newStatus === "CANCELLED") {
			await tx.bill.update({
				where: {
					id: existingPayment.billId,
				},

				data: {
					status: "UNPAID",
				},
			});
		}

		return payment;
	});

	return result;
};

const deletePayment = async (id: string) => {
	const existingPayment = await prisma.payment.findUnique({
		where: {
			id,
		},
	});

	if (!existingPayment) {
		throw new AppError(404, "Payment not found");
	}

	const deletedPayment = await prisma.payment.delete({
		where: {
			id,
		},
	});

	return deletedPayment;
};

export const paymentService = {
	createPayment,
	getAllPayments,
	getSinglePayment,
	getMyPayments,
	updatePayment,
	deletePayment,
};