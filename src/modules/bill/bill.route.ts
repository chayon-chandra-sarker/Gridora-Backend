import express from "express";

import { billController } from "./bill.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  billController.createBill,
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  billController.getAllBills,
);

router.get(
  "/my-bills",
  auth(UserRole.CUSTOMER),
  billController.getMyBills,
);

router.get(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  billController.getSingleBill,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  billController.updateBill,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  billController.deleteBill,
);

export const billRoutes = router;