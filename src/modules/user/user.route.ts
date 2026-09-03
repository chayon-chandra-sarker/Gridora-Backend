
import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router();

// Update My Profile
router.put(
  "/update",
  auth("CUSTOMER", "OPERATOR", "ADMIN"),
  userController.updateMyProfile,
);

// ================================
// Admin User Management
// ================================

// Get All Users
router.get(
  "/admin/all-users",
  auth("ADMIN"),
  userController.getAllUsers,
);

// Update User
router.put(
  "/admin/update/:id",
  auth("ADMIN"),
  userController.updateUser,
);

// Update User Role
router.put(
  "/admin/update/role/:id",
  auth("ADMIN"),
  userController.updateUserRole,
);

// Activate / Deactivate User
router.put(
  "/admin/update/status/:id",
  auth("ADMIN"),
  userController.updateUserStatus,
);

router.post(
  "/forgot-password",
  userController.forgotPassword,
);

export const userRouter = router;

