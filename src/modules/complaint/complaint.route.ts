import express from "express";

import { complaintController } from "./complaint.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();


router.post(
  "/",
  auth(UserRole.CUSTOMER),
  complaintController.createComplaint,
);


router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  complaintController.getAllComplaints,
);


router.get(
  "/my-complaints",
  auth(UserRole.CUSTOMER),
  complaintController.getMyComplaints,
);

router.get(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  complaintController.getSingleComplaint,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  complaintController.updateComplaint,
);


router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  complaintController.deleteComplaint,
);

export const complaintRoutes = router;