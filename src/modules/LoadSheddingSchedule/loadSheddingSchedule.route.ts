import express from "express";

import { loadSheddingScheduleController } from "./loadSheddingSchedule.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";


const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleController.createLoadSheddingSchedule,
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
  loadSheddingScheduleController.getAllLoadSheddingSchedules,
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
  loadSheddingScheduleController.getSingleLoadSheddingSchedule,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleController.updateLoadSheddingSchedule,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  loadSheddingScheduleController.deleteLoadSheddingSchedule,
);

export const loadSheddingScheduleRoutes = router;