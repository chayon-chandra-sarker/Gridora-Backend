import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import type { UserRole } from "../../generated/prisma/enums";

import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errors/AppError";
import config from "../config";

// ==================== EXPRESS REQUEST TYPE ====================

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				name: string;
				email: string;
				role: UserRole;
			};
		}
	}
}

// ==================== AUTH MIDDLEWARE ====================

export const auth = (...requiredRoles: UserRole[]) => {
	return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
		// Get access token from cookie or Authorization header
		const token = req.cookies.accessToken
			? req.cookies.accessToken
			: req.headers.authorization?.startsWith("Bearer ")
				? req.headers.authorization.split(" ")[1]
				: req.headers.authorization;

		// Token missing
		if (!token) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"You are not logged in. Please log in to access this resource.",
			);
		}

		// Verify token
		const decoded = jwtUtils.verifiedToken(
			token,
			config.jwt_access_secret,
		) as JwtPayload;

		const { id } = decoded;

		if (!id) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"Invalid authentication token.",
			);
		}

		// Get latest user information from database
		const user = await prisma.user.findUnique({
			where: {
				id: String(id),
			},
		});

		// User not found
		if (!user) {
			throw new AppError(
				httpStatus.NOT_FOUND,
				"User not found. Please login again.",
			);
		}

		// Check whether account is active
		if (!user.isActive) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"Your account is inactive. Please contact support.",
			);
		}

		// Check current database role
		if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"You don't have permission to access this resource.",
			);
		}

		// Attach user to request
		req.user = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		next();
	});
};
