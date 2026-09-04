
import express from "express";
import type { Application, Request, Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";

import { globalErrorHandler } from "./errors/globalErrorHandler";
import { sendResponse } from "./utils/sendResponse";
import { authRoutes } from "./modules/auth/auth.route";
import { userRouter } from "./modules/user/user.route";
import { areaRoutes } from "./modules/area/area.route";
import { loadSheddingScheduleRoutes } from "./modules/LoadSheddingSchedule/loadSheddingSchedule.route";
import { billRoutes } from "./modules/bill/bill.route";
import { tariffRoutes } from "./modules/tariff/tariff.route";
import { paymentRoutes } from "./modules/payment/payment.route";

// Import auth route later
// import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

// ==================== CORS ====================

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// ==================== BODY PARSER ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== COOKIE ====================

app.use(cookieParser());

// ==================== ROOT ROUTE ====================

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gridora API is running successfully",
    data: {
      name: "Gridora - A modern Electricity Billing, Load Shedding & Utility Management Platform",
      author: "Chayon Chandra Sarker",
    },
  });
});

// ==================== API ROUTES ====================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/area", areaRoutes);
app.use("/api/load-shedding-schedules", loadSheddingScheduleRoutes);
app.use("/api/tariffs", tariffRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
// ==================== GLOBAL ERROR HANDLER ====================

app.use(globalErrorHandler);

export default app;

