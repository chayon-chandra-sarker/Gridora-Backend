import express from "express";

import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  paymentController.createPayment,
);

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  paymentController.getAllPayments,
);

router.get(
  "/my-payments",
  auth(UserRole.CUSTOMER),
  paymentController.getMyPayments,
);

router.post(
  "/bkash/create",
  auth(UserRole.CUSTOMER),
  paymentController.createPaymentBkash,
);


router.get(
  "/bkash/callback",
  paymentController.bkashCallback,
);

router.get(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  paymentController.getSinglePayment,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  paymentController.updatePayment,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  paymentController.deletePayment,
);

export const paymentRoutes = router;