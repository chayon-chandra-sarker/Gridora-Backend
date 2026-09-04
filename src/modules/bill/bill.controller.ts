import type { Request, Response } from "express";

import { billService } from "./bill.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const createBill = catchAsync(
  async (req: Request, res: Response) => {
    const result = await billService.createBill(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Bill created successfully",
      data: result,
    });
  },
);


const getAllBills = catchAsync(
  async (req: Request, res: Response) => {
    const result = await billService.getAllBills();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bills retrieved successfully",
      data: result,
    });
  },
);


const getSingleBill = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid bill id");
    }

    const result = await billService.getSingleBill(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bill retrieved successfully",
      data: result,
    });
  },
);


const getMyBills = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await billService.getMyBills(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Your bills retrieved successfully",
      data: result,
    });
  },
);


const updateBill = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid bill id");
    }

    const result = await billService.updateBill(
      id,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bill updated successfully",
      data: result,
    });
  },
);


const deleteBill = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error("Invalid bill id");
    }

    const result = await billService.deleteBill(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bill deleted successfully",
      data: result,
    });
  },
);

export const billController = {
  createBill,
  getAllBills,
  getSingleBill,
  getMyBills,
  updateBill,
  deleteBill,
};