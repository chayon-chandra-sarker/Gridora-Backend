import { prisma } from "../../lib/prisma";

import type {
  ICreateBill,
  IUpdateBill,
} from "./bill.interface";

import { pdfService } from "../pdf/pdf.service";
import { emailService } from "../email/email.service";



const parseDueDate = (dueDate: string): Date => {
  const date = new Date(dueDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid due date");
  }

  return date;
};

const calculateBillAmount = async (units: number) => {
  if (units < 0) {
    throw new Error("Units cannot be negative");
  }

  const tariffs = await prisma.tariff.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      minUnit: "asc",
    },
  });

  if (tariffs.length === 0) {
    throw new Error("No active tariff found");
  }

  let remainingUnits = units;
  let totalAmount = 0;

  for (const tariff of tariffs) {
    if (remainingUnits <= 0) {
      break;
    }

    const minUnit = tariff.minUnit;
    const maxUnit = tariff.maxUnit;

    if (units < minUnit) {
      continue;
    }

    let slabUnits: number;

    if (maxUnit === null) {
      slabUnits = units - minUnit + 1;
    } else {
      slabUnits =
        Math.min(units, maxUnit) -
        minUnit +
        1;
    }

    if (slabUnits <= 0) {
      continue;
    }

    const unitsInSlab = Math.min(
      remainingUnits,
      slabUnits,
    );

    totalAmount +=
      unitsInSlab *
      Number(tariff.pricePerUnit);

    remainingUnits -= unitsInSlab;
  }

  if (remainingUnits > 0) {
    throw new Error(
      "No tariff found for all consumed units",
    );
  }

  return Number(totalAmount.toFixed(2));
};

const createBill = async (
  payload: ICreateBill,
) => {
  const {
    userId,
    billingMonth,
    meterNumber,
    previousReading,
    currentReading,
    dueDate,
  } = payload;

  if (
    previousReading < 0 ||
    currentReading < 0
  ) {
    throw new Error(
      "Reading cannot be negative",
    );
  }

  if (currentReading < previousReading) {
    throw new Error(
      "Current reading must be greater than or equal to previous reading",
    );
  }

  const units =
    currentReading - previousReading;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.email) {
    throw new Error(
      "Customer email is not available",
    );
  }


  const existingBill =
    await prisma.bill.findUnique({
      where: {
        userId_billingMonth: {
          userId,
          billingMonth,
        },
      },
    });

  if (existingBill) {
    throw new Error(
      "Bill already exists for this user and billing month",
    );
  }


  const amount =
    await calculateBillAmount(units);

  const parsedDueDate =
    parseDueDate(dueDate);

  const bill = await prisma.bill.create({
    data: {
      userId,
      billingMonth,
      meterNumber,
      previousReading,
      currentReading,
      units,
      amount,
      dueDate: parsedDueDate,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          customerNumber: true,
          meterNumber: true,
          address: true,
          role: true,
          isActive: true,
          areaId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const billPdf =
    await pdfService.generateBillPdf({
      billId: bill.id,

      customerName:
        bill.user.name,

      customerEmail:
        bill.user.email,

      meterNumber:
        bill.meterNumber,

      billingMonth:
        bill.billingMonth,

      previousReading:
        bill.previousReading,

      currentReading:
        bill.currentReading,

      units:
        bill.units,

      amount:
        Number(bill.amount),

      dueDate:
        bill.dueDate,

      status:
        bill.status,
    });


  try {
    await emailService.sendBillEmail(
      bill.user.email,
      bill.user.name,
      bill.billingMonth,
      billPdf,
    );

    console.log(
      `Bill PDF email sent successfully to ${bill.user.email}`,
    );
  } catch (error) {
    console.error(
      "Failed to send bill PDF email:",
      error,
    );
  }

  return bill;
};

const getAllBills = async () => {
  const bills =
    await prisma.bill.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customerNumber: true,
            meterNumber: true,
            address: true,
            role: true,
            isActive: true,
            areaId: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        payments: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return bills;
};


const getSingleBill = async (
  id: string,
) => {
  const bill =
    await prisma.bill.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customerNumber: true,
            meterNumber: true,
            address: true,
            role: true,
            isActive: true,
            areaId: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        payments: true,
      },
    });

  if (!bill) {
    throw new Error("Bill not found");
  }

  return bill;
};


const getMyBills = async (
  userId: string,
) => {
  const bills =
    await prisma.bill.findMany({
      where: {
        userId,
      },

      include: {
        payments: true,
      },

      orderBy: {
        billingMonth: "desc",
      },
    });

  return bills;
};


const updateBill = async (
  id: string,
  payload: IUpdateBill,
) => {
  const existingBill =
    await prisma.bill.findUnique({
      where: {
        id,
      },
    });

  if (!existingBill) {
    throw new Error("Bill not found");
  }


  if (payload.userId !== undefined) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

    if (!user) {
      throw new Error("User not found");
    }
  }

  if (
    payload.userId !== undefined ||
    payload.billingMonth !== undefined
  ) {
    const userId =
      payload.userId ??
      existingBill.userId;

    const billingMonth =
      payload.billingMonth ??
      existingBill.billingMonth;

    const duplicateBill =
      await prisma.bill.findFirst({
        where: {
          userId,
          billingMonth,

          NOT: {
            id,
          },
        },
      });

    if (duplicateBill) {
      throw new Error(
        "Bill already exists for this user and billing month",
      );
    }
  }


  const previousReading =
    payload.previousReading ??
    existingBill.previousReading;

  const currentReading =
    payload.currentReading ??
    existingBill.currentReading;

  if (
    previousReading < 0 ||
    currentReading < 0
  ) {
    throw new Error(
      "Reading cannot be negative",
    );
  }

  if (currentReading < previousReading) {
    throw new Error(
      "Current reading must be greater than or equal to previous reading",
    );
  }

  const units =
    currentReading - previousReading;

  const amount =
    await calculateBillAmount(units);
  let parsedDueDate =
    existingBill.dueDate;

  if (payload.dueDate !== undefined) {
    parsedDueDate =
      parseDueDate(payload.dueDate);
  }

  const bill =
    await prisma.bill.update({
      where: {
        id,
      },

      data: {
        ...(payload.userId !== undefined && {
          userId: payload.userId,
        }),

        ...(payload.billingMonth !==
          undefined && {
          billingMonth:
            payload.billingMonth,
        }),

        ...(payload.meterNumber !==
          undefined && {
          meterNumber:
            payload.meterNumber,
        }),

        previousReading,
        currentReading,
        units,
        amount,

        dueDate: parsedDueDate,

        ...(payload.status !==
          undefined && {
          status: payload.status,
        }),
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customerNumber: true,
            meterNumber: true,
            address: true,
            role: true,
            isActive: true,
            areaId: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        payments: true,
      },
    });

  return bill;
};


const deleteBill = async (
  id: string,
) => {
  const existingBill =
    await prisma.bill.findUnique({
      where: {
        id,
      },
    });

  if (!existingBill) {
    throw new Error("Bill not found");
  }

  const bill =
    await prisma.bill.delete({
      where: {
        id,
      },
    });

  return bill;
};


export const billService = {
  createBill,
  getAllBills,
  getSingleBill,
  getMyBills,
  updateBill,
  deleteBill,
};