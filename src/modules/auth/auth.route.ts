import { Router } from "express";

import { authController } from "./auth.controller";

import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/google", authController.googleLogin);

router.post("/refresh-token", authController.refreshToken);

router.get(
	"/me",
	auth("CUSTOMER", "OPERATOR", "ADMIN"),
	authController.getMe,
);

router.post("/logout", authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/verify-otp", authController.verifyOtp);

router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;