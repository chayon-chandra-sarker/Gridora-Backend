import { Router } from "express";

import { userController } from "./user.controller";

import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.put(
	"/update",
	auth("CUSTOMER", "OPERATOR", "ADMIN"),
	userController.updateMyProfile,
);

router.post(
	"/profile-image",
	auth("CUSTOMER", "OPERATOR", "ADMIN"),
	upload.single("image"),
	userController.uploadProfileImage,
);

router.get("/admin/all-users", auth("ADMIN"), userController.getAllUsers);

router.put("/admin/update/:id", auth("ADMIN"), userController.updateUser);

router.put(
	"/admin/update/role/:id",
	auth("ADMIN"),
	userController.updateUserRole,
);

router.put(
	"/admin/update/status/:id",
	auth("ADMIN"),
	userController.updateUserStatus,
);

router.post("/forgot-password", userController.forgotPassword);

export const userRouter = router;
