import { Request, Response } from "express";
import { lockOrder, unlockOrder } from "../utils/locker-manager";
import { delay } from "../utils/delay";
import { generateOrderNumber } from "../utils/order-number";
import path from "path";
import { saveOrderWithRetry } from "../utils/save-order";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id_customer = req.params.id;
  const { address, payment_type, items } = req.body;

  if (!lockOrder(id_customer)) {
    res.status(429).send({
      message: "order is being processed for customer",
    });
    return;
  }

  await delay(3000);

  const orderNumber = generateOrderNumber(id_customer);

  const filePath = path.join(
    __dirname,
    "../database/customer-order",
    `${orderNumber}.json`
  );

  const countTotal = items.reduce((acc: number, item: any) => {
    return acc + item.price * item.qty;
  }, 0);

  try {
    await saveOrderWithRetry(filePath, {
      no_order: orderNumber,
      id_customer: id_customer,
      name: "John Doe", // from database
      email: "jhon.doe@gmail.com", // from database
      address: address,
      payment_type: payment_type,
      items: items,
      total: countTotal,
      status: "Order Diterima",
    });

    res.status(201).json({
      message: "Order berhasil diproses",
      result: {
        order_number: orderNumber,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving order", error: (error as Error).message });
  } finally {
    unlockOrder(id_customer);
  }
};
