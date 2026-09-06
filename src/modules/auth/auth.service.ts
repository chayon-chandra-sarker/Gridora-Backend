import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import type { JwtPayload } from "jsonwebtoken";

import config from "../../config";
import redis from "../../config/redis";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { sendOTPEmail } from "../../utils/email";

import type { ILoginUser, IRegisterUser } from "./auth.interface";
import AppError from "../../errors/AppError";

const googleClient = new OAuth2Client(config.google_client_id);

const registerUser = async (payload: IRegisterUser) => {
	const {
		name,
		email,
		password,
		phone,
		customerNumber,
		meterNumber,
		address,
	} = payload;

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw new AppError(409, "User with this email already exists");
	}

	if (customerNumber) {
		const existingCustomerNumber = await prisma.user.findUnique({
			where: { customerNumber },
		});

		if (existingCustomerNumber) {
			throw new AppError(409, "Customer number already exists");
		}
	}

	if (meterNumber) {
		const existingMeterNumber = await prisma.user.findUnique({
			where: { meterNumber },
		});

		if (existingMeterNumber) {
			throw new AppError(409, "Meter number already exists");
		}
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role: "CUSTOMER",

			...(phone && { phone }),
			...(customerNumber && { customerNumber }),
			...(meterNumber && { meterNumber }),
			...(address && { address }),
		},

		select: {
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
		},
	});

	return user;
};

const loginUser = async (payload: ILoginUser) => {
	const { email, password } = payload;

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new AppError(401, "Invalid email or password");
	}

	if (!user.isActive) {
		throw new AppError(403, "Your account is inactive");
	}

	if (!user.password) {
		throw new AppError(400, "This account does not have a password");
	}

	const isPasswordMatched = await bcrypt.compare(
		password,
		user.password,
	);

	if (!isPasswordMatched) {
		throw new AppError(401, "Invalid email or password");
	}

	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const googleLogin = async (idToken: string) => {
	const ticket = await googleClient.verifyIdToken({
		idToken,
		audience: config.google_client_id,
	});

	const payload = ticket.getPayload();

	if (!payload) {
		throw new AppError(401, "Invalid Google token");
	}

	const {
		sub: googleId,
		email,
		name,
		email_verified,
	} = payload;

	if (!googleId || !email) {
		throw new AppError(
			400,
			"Google account information is incomplete",
		);
	}

	if (!email_verified) {
		throw new AppError(401, "Google email is not verified");
	}

	// Check user by Google ID
	let user = await prisma.user.findUnique({
		where: {
			googleId,
		},
	});

	// If Google ID doesn't exist, check email
	if (!user) {
		user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		// Existing email/password user -> link Google account
		if (user) {
			if (!user.isActive) {
				throw new AppError(403, "Your account is inactive");
			}

			if (!user.googleId) {
				user = await prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						googleId,
					},
				});
			}
		}
	}

	// Create new Google user
	if (!user) {
		user = await prisma.user.create({
			data: {
				name: name || "Google User",
				email,
				googleId,
				role: "CUSTOMER",
				isActive: true,
			},
		});
	}

	if (!user.isActive) {
		throw new AppError(403, "Your account is inactive");
	}

	const jwtPayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const refreshToken = async (token: string) => {
	const verifiedToken = jwtUtils.verifiedToken(
		token,
		config.jwt_refresh_secret,
	);

	const jwtPayload = verifiedToken as JwtPayload & {
		id: string;
		name: string;
		email: string;
		role: string;
	};

	const accessToken = jwtUtils.createToken(
		{
			id: jwtPayload.id,
			name: jwtPayload.name,
			email: jwtPayload.email,
			role: jwtPayload.role,
		},
		config.jwt_access_secret,
		config.jwt_access_expires_in,
	);

	return {
		accessToken,
	};
};

const getMe = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},

		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
			phone: true,
			customerNumber: true,
			meterNumber: true,
			address: true,
			areaId: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	return user;
};

const forgotPassword = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	// Generate 6 digit OTP
	const otp = Math.floor(
		100000 + Math.random() * 900000,
	).toString();

	// Redis key
	const redisKey = `password-reset:${email}`;

	// Store OTP in Redis for 2 minutes
	await redis.set(
		redisKey,
		otp,
		"EX",
		120,
	);

	// Send OTP email
	await sendOTPEmail(email, otp);

	return {
		email,
		message:
			"OTP sent successfully. OTP will expire in 2 minutes.",
	};
};

const verifyOtp = async (
	email: string,
	otp: string,
) => {
	const redisKey = `password-reset:${email}`;

	// Get OTP from Redis
	const storedOTP = await redis.get(redisKey);

	if (!storedOTP) {
		throw new AppError(400, "OTP expired or not found");
	}

	// Compare OTP
	if (storedOTP !== otp) {
		throw new AppError(400, "Invalid OTP");
	}

	return {
		message: "OTP verified successfully",
		email,
	};
};

const resetPassword = async (
	email: string,
	otp: string,
	newPassword: string,
) => {
	// Password validation
	if (!newPassword || newPassword.length < 8) {
		throw new AppError(
			400,
			"Password must be at least 8 characters long",
		);
	}

	// Find user
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found");
	}

	// Redis key
	const redisKey = `password-reset:${email}`;

	// Get OTP from Redis
	const storedOTP = await redis.get(redisKey);

	if (!storedOTP) {
		throw new AppError(
			400,
			"OTP expired or password reset request not found",
		);
	}

	// Verify OTP
	if (storedOTP !== otp) {
		throw new AppError(400, "Invalid OTP");
	}

	// Hash new password
	const hashedPassword = await bcrypt.hash(
		newPassword,
		10,
	);

	// Update password
	await prisma.user.update({
		where: {
			id: user.id,
		},

		data: {
			password: hashedPassword,
		},
	});

	// Delete OTP after successful reset
	await redis.del(redisKey);

	return {
		message: "Password reset successfully",
	};
};

export const authService = {
	registerUser,
	loginUser,
	googleLogin,
	refreshToken,
	getMe,
	forgotPassword,
	verifyOtp,
	resetPassword,
};