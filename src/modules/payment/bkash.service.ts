import config from "../../config";
import { prisma } from "../../lib/prisma";

import { paymentService } from "../payment/payment.service";

export const getBkashIdToken = async () => {
  const url =
    `${config.bkash_base_url}` +
    `/tokenized/checkout/token/grant`;

  try {
    console.log("bKash Token URL:", url);

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: config.bkash_user_name,
        password: config.bkash_password,
      },

      body: JSON.stringify({
        app_key:
          config.bkash_app_key,

        app_secret:
          config.bkash_app_secret,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "bKash token response:",
        result,
      );

      throw new Error(
        result?.statusMessage ||
          result?.message ||
          "Failed to get bKash token",
      );
    }

    return result;
  } catch (error) {
    console.error(
      "bKash token request failed:",
      error,
    );

    if (error instanceof Error) {
      throw new Error(
        `bKash connection failed: ${error.message}`,
      );
    }

    throw new Error(
      "Failed to connect to bKash",
    );
  }
};

export const createBkashPayment = async (
  userId: string,
  billId: string,
) => {
 
  const bill =
    await prisma.bill.findUnique({
      where: {
        id: billId,
      },
    });

  if (!bill) {
    throw new Error("Bill not found");
  }


  if (bill.userId !== userId) {
    throw new Error(
      "This bill does not belong to you",
    );
  }

  if (bill.status === "PAID") {
    throw new Error(
      "This bill has already been paid",
    );
  }


  const tokenResponse =
    await getBkashIdToken();

  const idToken =
    tokenResponse?.id_token;

  if (!idToken) {
    throw new Error(
      "Failed to get bKash ID token",
    );
  }


  const response = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: idToken,
        "X-APP-Key":
          config.bkash_app_key,
      },

      body: JSON.stringify({
        mode: "0011",

        payerReference: userId,

        callbackURL:
          `${config.app_url}` +
          `/api/payments/bkash/callback`,

        amount:
          Number(bill.amount).toFixed(2),

        currency: "BDT",

        intent: "sale",

        merchantInvoiceNumber:
          `INV-${bill.id}`,
      }),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.statusMessage ||
        "Failed to create bKash payment",
    );
  }

  if (!result?.paymentID) {
    throw new Error(
      "bKash payment ID not found",
    );
  }


  const payment =
    await paymentService.createPayment({
      userId,
      billId,
      amount: Number(bill.amount),
      method: "BKASH",
      paymentId: result.paymentID,
    });

  return {
    ...result,
    payment,
  };
};


export const executeBkashPayment = async (
  paymentID: string,
) => {

  const tokenResponse =
    await getBkashIdToken();

  const idToken =
    tokenResponse?.id_token;

  if (!idToken) {
    throw new Error(
      "Failed to get bKash ID token",
    );
  }

  const response = await fetch(
    `${config.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: idToken,
        "X-APP-Key":
          config.bkash_app_key,
      },

      body: JSON.stringify({
        paymentID,
      }),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.statusMessage ||
        "Failed to execute bKash payment",
    );
  }


  const payment =
    await prisma.payment.findUnique({
      where: {
        paymentId: paymentID,
      },
    });

  if (!payment) {
    throw new Error(
      "Payment record not found for this bKash payment",
    );
  }


  const isSuccessful =
    result?.transactionStatus ===
      "Completed" &&
    result?.statusCode === "0000";

  if (!isSuccessful) {
  
    const failedPayment =
      await paymentService.updatePayment(
        payment.id,
        {
          status: "FAILED",
        },
      );

    return {
      success: false,
      bkash: result,
      payment: failedPayment,
    };
  }

  const updatedPayment =
    await paymentService.updatePayment(
      payment.id,
      {
        status: "SUCCESS",
        transactionId:
          result.trxID,
      },
    );

  return {
    success: true,
    bkash: result,
    payment: updatedPayment,
  };
};