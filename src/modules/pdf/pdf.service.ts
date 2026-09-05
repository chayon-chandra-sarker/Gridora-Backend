import PDFDocument from "pdfkit";

import type { IBillPdfData, IPaymentInvoicePdfData } from "./pdf.interface";

const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const generateBillPdf = async (data: IBillPdfData): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const doc = new PDFDocument({
				size: "A4",
				margin: 50,
			});

			const chunks: Buffer[] = [];

			doc.on("data", (chunk: Buffer) => {
				chunks.push(chunk);
			});

			doc.on("end", () => {
				resolve(Buffer.concat(chunks));
			});

			doc.on("error", (error) => {
				reject(error);
			});

			doc.fontSize(24).font("Helvetica-Bold").text("GRIDORA", {
				align: "center",
			});

			doc
				.moveDown(0.5)
				.fontSize(16)
				.font("Helvetica")
				.text("Electricity Bill", {
					align: "center",
				});

			doc.moveDown(2);

			doc.fontSize(12).font("Helvetica-Bold").text("Bill Information");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Bill ID: ${data.billId}`)
				.text(`Billing Month: ${data.billingMonth}`)
				.text(`Status: ${data.status}`)
				.text(`Due Date: ${formatDate(data.dueDate)}`);

			doc.moveDown(1.5);

			doc.fontSize(12).font("Helvetica-Bold").text("Customer Information");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Customer Name: ${data.customerName}`)
				.text(`Meter Number: ${data.meterNumber}`);

			if (data.customerEmail) {
				doc.text(`Email: ${data.customerEmail}`);
			}

			doc.moveDown(1.5);

			doc.fontSize(12).font("Helvetica-Bold").text("Meter Reading");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Previous Reading: ${data.previousReading}`)
				.text(`Current Reading: ${data.currentReading}`)
				.text(`Units Consumed: ${data.units}`);

			doc.moveDown(1.5);

			doc
				.fontSize(16)
				.font("Helvetica-Bold")
				.text(`Total Amount: BDT ${Number(data.amount).toFixed(2)}`, {
					align: "right",
				});

			doc.moveDown(2);

			doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

			doc.moveDown(1);

			doc
				.fontSize(9)
				.font("Helvetica")
				.text("This is a computer-generated electricity bill from Gridora.", {
					align: "center",
				});

			doc.moveDown(0.5).text("Please pay your bill before the due date.", {
				align: "center",
			});

			doc.end();
		} catch (error) {
			reject(error);
		}
	});
};

// Generate Payment Invoice PDF
const generatePaymentInvoicePdf = async (
	data: IPaymentInvoicePdfData,
): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		try {
			const doc = new PDFDocument({
				size: "A4",
				margin: 50,
			});

			const chunks: Buffer[] = [];

			doc.on("data", (chunk: Buffer) => {
				chunks.push(chunk);
			});

			doc.on("end", () => {
				resolve(Buffer.concat(chunks));
			});

			doc.on("error", (error) => {
				reject(error);
			});

			doc.fontSize(24).font("Helvetica-Bold").text("GRIDORA", {
				align: "center",
			});

			doc.moveDown(0.5).fontSize(16).font("Helvetica").text("Payment Invoice", {
				align: "center",
			});

			doc.moveDown(2);

			doc.fontSize(12).font("Helvetica-Bold").text("Invoice Information");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Invoice Number: ${data.invoiceNumber}`)
				.text(`Bill ID: ${data.billId}`)
				.text(`Payment Date: ${formatDate(data.paymentDate)}`)
				.text(`Payment Status: ${data.status}`);

			doc.moveDown(1.5);

			doc.fontSize(12).font("Helvetica-Bold").text("Customer Information");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Customer Name: ${data.customerName}`)
				.text(`Meter Number: ${data.meterNumber}`);

			if (data.customerEmail) {
				doc.text(`Email: ${data.customerEmail}`);
			}

			doc.moveDown(1.5);

			doc.fontSize(12).font("Helvetica-Bold").text("Payment Details");

			doc.moveDown(0.5);

			doc
				.fontSize(10)
				.font("Helvetica")
				.text(`Payment Method: ${data.paymentMethod}`)
				.text(`Amount: BDT ${Number(data.amount).toFixed(2)}`);

			if (data.paymentId) {
				doc.text(`bKash Payment ID: ${data.paymentId}`);
			}

			if (data.transactionId) {
				doc.text(`Transaction ID: ${data.transactionId}`);
			}

			doc.moveDown(2);

			doc
				.fontSize(16)
				.font("Helvetica-Bold")
				.text(`Paid Amount: BDT ${Number(data.amount).toFixed(2)}`, {
					align: "right",
				});

			doc.moveDown(2);

			doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

			doc.moveDown(1);

			doc.fontSize(9).font("Helvetica").text("Payment received successfully.", {
				align: "center",
			});

			doc.moveDown(0.5).text("Thank you for using Gridora.", {
				align: "center",
			});

			doc.end();
		} catch (error) {
			reject(error);
		}
	});
};

export const pdfService = {
	generateBillPdf,
	generatePaymentInvoicePdf,
};
