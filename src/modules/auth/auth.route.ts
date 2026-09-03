
import { Router } from "express";

import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";

const router = Router();

// Register
router.post("/register", authController.registerUser);

// Login
router.post("/login", authController.loginUser);

// Google Login
router.post("/google", authController.googleLogin);

// Refresh access token
router.post("/refresh-token", authController.refreshToken);

// Get current logged-in user
router.get("/me", auth(), authController.getMe);

// Logout
router.post("/logout", authController.logout);

export const authRoutes = router;

