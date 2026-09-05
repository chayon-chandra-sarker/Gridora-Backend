import nodemailer from "nodemailer";

import config from "../../config";

// Create transporter
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.email_user,
		pass: config.email_pass,
	},
});

// Send Bill PDF Email
const sendBillEmail = async (
	to: string,
	customerName: string,
	billingMonth: string,
	pdfBuffer: Buffer,
) => {
	await transporter.sendMail({
		from: `"Gridora" <${config.email_user}>`,
		to,
		subject: `Gridora Electricity Bill - ${billingMonth}`,
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Gridora Electricity Bill</h2>

        <p>Hello <strong>${customerName}</strong>,</p>

        <p>
          Your electricity bill for
          <strong>${billingMonth}</strong>
          is attached to this email.
        </p>

        <p>
          Please check the attached PDF and pay your bill
          before the due date.
        </p>

        <br />

        <p>
          Thank you for using <strong>Gridora</strong>.
        </p>
      </div>
    `,
		attachments: [
			{
				filename: `Gridora-Bill-${billingMonth}.pdf`,
				content: pdfBuffer,
				contentType: "application/pdf",
			},
		],
	});
};

// Send Payment Invoice Email
const sendPaymentInvoiceEmail = async (
	to: string,
	customerName: string,
	invoiceNumber: string,
	pdfBuffer: Buffer,
) => {
	await transporter.sendMail({
		from: `"Gridora" <${config.email_user}>`,
		to,
		subject: `Gridora Payment Invoice - ${invoiceNumber}`,
		html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Gridora Payment Successful</h2>

        <p>Hello <strong>${customerName}</strong>,</p>

        <p>
          Your payment has been
          <strong style="color: green;">successfully completed</strong>.
        </p>

        <p>
          Your payment invoice is attached to this email.
        </p>

        <p>
          <strong>Invoice Number:</strong>
          ${invoiceNumber}
        </p>

        <br />

        <p>
          Thank you for using <strong>Gridora</strong>.
        </p>
      </div>
    `,
		attachments: [
			{
				filename: `Gridora-Invoice-${invoiceNumber}.pdf`,
				content: pdfBuffer,
				contentType: "application/pdf",
			},
		],
	});
};

export const emailService = {
	sendBillEmail,
	sendPaymentInvoiceEmail,
};
