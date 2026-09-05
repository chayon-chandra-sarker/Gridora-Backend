import type {
	PaymentMethod,
	PaymentStatus,
} from "../../../generated/prisma/enums";

export interface ICreatePayment {
	userId: string;
	billId: string;
	amount: number;
	method?: PaymentMethod;
	transactionId?: string;
	paymentId?: string;
}

export interface IUpdatePayment {
	amount?: number;
	method?: PaymentMethod;
	status?: PaymentStatus;
	transactionId?: string;
	paymentId?: string;
}
