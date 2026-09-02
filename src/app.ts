import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./errors/globalErrorHandler";

import { sendResponse } from "./utils/sendResponse";
import httpStatus from "http-status";

const app: Application = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Gridora API is running successfully",
    data: {
      name: "Gridora A modern Electricity Billing, Load Shedding & Utility Management Platform",
      author: "Chayon Chandra Sarker",
    },
  });
});

// app.use("/api/auth", userRouter);


app.use(globalErrorHandler);
export default app;
