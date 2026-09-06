import { z } from "zod";

const registerValidationSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters long")
			.max(100, "Name must not exceed 100 characters"),

		email: z.string().email("Please provide a valid email address"),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.max(100, "Password must not exceed 100 characters"),

		phone: z
			.string()
			.min(10, "Phone number must be at least 10 characters")
			.max(15, "Phone number must not exceed 15 characters")
			.optional(),

		customerNumber: z
			.string()
			.min(1, "Customer number cannot be empty")
			.optional(),

		meterNumber: z.string().min(1, "Meter number cannot be empty").optional(),

		address: z
			.string()
			.min(3, "Address must be at least 3 characters")
			.optional(),
	}),
});

const loginValidationSchema = z.object({
	body: z.object({
		email: z.string().email("Please provide a valid email address"),

		password: z.string().min(8, "Password must be at least 8 characters long"),
	}),
});

const googleLoginValidationSchema = z.object({
	body: z.object({
		idToken: z.string().min(1, "Google ID token is required"),
	}),
});

const forgotPasswordValidationSchema = z.object({
	body: z.object({
		email: z.string().email("Please provide a valid email address"),
	}),
});

const verifyOtpValidationSchema = z.object({
	body: z.object({
		email: z.string().email("Please provide a valid email address"),

		otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
	}),
});

const resetPasswordValidationSchema = z.object({
	body: z.object({
		email: z.string().email("Please provide a valid email address"),

		otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.max(100, "Password must not exceed 100 characters"),
	}),
});

export const authValidation = {
	registerValidationSchema,
	loginValidationSchema,
	googleLoginValidationSchema,
	forgotPasswordValidationSchema,
	verifyOtpValidationSchema,
	resetPasswordValidationSchema,
};
