import nodemailer from "nodemailer";
import config from "../config";

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: config.email_user,
		pass: config.email_pass,
	},
});

// Send OTP Email
export const sendOTPEmail = async (
	email: string,
	otp: string,
): Promise<void> => {
	await transporter.sendMail({
		from: `"Gridora" <${config.email_user}>`,
		to: email,
		subject: "Gridora - Password Reset OTP",
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>Gridora Password Reset</h2>

        <p>You requested to reset your Gridora account password.</p>

        <p>Your OTP is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          padding: 15px;
          background: #f4f4f4;
          text-align: center;
          border-radius: 8px;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in <strong>2 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>Regards,<br />Gridora Team</p>
      </div>
    `,
	});
};
