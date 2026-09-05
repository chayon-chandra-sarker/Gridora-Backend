export interface IBillPdfData {
	billId: string;
	customerName: string;
	customerEmail?: string;
	meterNumber: string;
	billingMonth: string;
	previousReading: number;
	currentReading: number;
	units: number;
	amount: string | number;
	dueDate: string | Date;
	status: string;
}

export interface IPaymentInvoicePdfData {
	invoiceNumber: string;
	customerName: string;
	customerEmail?: string;
	meterNumber: string;
	billId: string;
	amount: string | number;
	paymentMethod: string;
	paymentId?: string | null;
	transactionId?: string | null;
	paymentDate: string | Date;
	status: string;
}
