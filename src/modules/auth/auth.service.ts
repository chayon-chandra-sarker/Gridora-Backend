import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import type { JwtPayload } from "jsonwebtoken";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";

import type { ILoginUser, IRegisterUser } from "./auth.interface";

const googleClient = new OAuth2Client(config.google_client_id);

const registerUser = async (payload: IRegisterUser) => {
	const { name, email, password, phone, customerNumber, meterNumber, address } =
		payload;

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw new Error("User with this email already exists");
	}

	if (customerNumber) {
		const existingCustomerNumber = await prisma.user.findUnique({
			where: { customerNumber },
		});

		if (existingCustomerNumber) {
			throw new Error("Customer number already exists");
		}
	}

	if (meterNumber) {
		const existingMeterNumber = await prisma.user.findUnique({
			where: { meterNumber },
		});

		if (existingMeterNumber) {
			throw new Error("Meter number already exists");
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
		throw new Error("Invalid email or password");
	}

	if (!user.isActive) {
		throw new Error("Your account is inactive");
	}

	if (!user.password) {
		throw new Error("This account does not have a password");
	}

	const isPasswordMatched = await bcrypt.compare(password, user.password);

	if (!isPasswordMatched) {
		throw new Error("Invalid email or password");
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
		throw new Error("Invalid Google token");
	}

	const { sub: googleId, email, name, email_verified } = payload;

	if (!googleId || !email) {
		throw new Error("Google account information is incomplete");
	}

	if (!email_verified) {
		throw new Error("Google email is not verified");
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
				throw new Error("Your account is inactive");
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
		throw new Error("Your account is inactive");
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
		throw new Error("User not found");
	}

	return user;
};

const verifyOtp = async (email: string, otp: string) => {
	const passwordReset = await prisma.passwordReset.findFirst({
		where: {
			email,
			used: false,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!passwordReset) {
		throw new Error("Invalid OTP");
	}

	if (passwordReset.expiresAt < new Date()) {
		throw new Error("OTP has expired");
	}

	// Compare plain OTP with hashed OTP
	const isOtpMatched = await bcrypt.compare(otp, passwordReset.otp);

	if (!isOtpMatched) {
		throw new Error("Invalid OTP");
	}

	return {
		message: "OTP verified successfully",
		resetId: passwordReset.id,
	};
};

const resetPassword = async (resetId: string, newPassword: string) => {
	// Password validation
	if (!newPassword || newPassword.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}

	const passwordReset = await prisma.passwordReset.findUnique({
		where: {
			id: resetId,
		},
	});

	if (!passwordReset) {
		throw new Error("Invalid password reset request");
	}

	if (passwordReset.used) {
		throw new Error("Password reset request has already been used");
	}

	if (passwordReset.expiresAt < new Date()) {
		throw new Error("Password reset request has expired");
	}

	const user = await prisma.user.findUnique({
		where: {
			email: passwordReset.email,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.$transaction([
		prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
			},
		}),

		prisma.passwordReset.update({
			where: {
				id: passwordReset.id,
			},
			data: {
				used: true,
			},
		}),
	]);

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
	verifyOtp,
	resetPassword,
};
