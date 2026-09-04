import express from "express";

import { tariffController } from "./tariff.controller";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";


const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  tariffController.createTariff,
);

router.get(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  tariffController.getAllTariffs,
);

router.get(
  "/active",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  tariffController.getActiveTariffs,
);

router.get(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.CUSTOMER,
  ),
  tariffController.getSingleTariff,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  tariffController.updateTariff,
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  tariffController.deleteTariff,
);

export const tariffRoutes = router;