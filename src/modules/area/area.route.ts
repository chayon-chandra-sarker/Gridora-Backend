import express from "express";

import { areaController } from "./area.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.post("/create", auth(UserRole.ADMIN), areaController.createArea);

router.get(
	"/get-all",
	auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
	areaController.getAllAreas,
);

router.get(
	"/:id",
	auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
	areaController.getSingleArea,
);

router.put(
	"/:id",
	auth(UserRole.ADMIN, UserRole.OPERATOR),
	areaController.updateArea,
);

router.delete("/:id", auth(UserRole.ADMIN), areaController.deleteArea);

export const areaRoutes = router;
