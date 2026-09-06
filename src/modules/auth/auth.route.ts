import { Router } from "express";

import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";

import { auth } from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post(
	"/register",
	validateRequest(authValidation.registerValidationSchema),
	authController.registerUser,
);

router.post(
	"/login",
	validateRequest(authValidation.loginValidationSchema),
	authController.loginUser,
);

router.post(
	"/google",
	validateRequest(authValidation.googleLoginValidationSchema),
	authController.googleLogin,
);

router.post("/refresh-token", authController.refreshToken);

router.get(
	"/me",
	auth("CUSTOMER", "OPERATOR", "ADMIN"),
	authController.getMe,
);

router.post("/logout", authController.logout);

router.post(
	"/forgot-password",
	validateRequest(authValidation.forgotPasswordValidationSchema),
	authController.forgotPassword,
);

router.post(
	"/verify-otp",
	validateRequest(authValidation.verifyOtpValidationSchema),
	authController.verifyOtp,
);

router.post(
	"/reset-password",
	validateRequest(authValidation.resetPasswordValidationSchema),
	authController.resetPassword,
);

export const authRoutes = router;