import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import moment from "moment";

const app = express();
const port = parseInt("3000");
const orderStoragePath = path.join(__dirname, "database", "customer-order");

app.use(express.json());

let orderCount = 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateOrderNumber = (customerId: number): string => {
  const formattedDate = moment().format("DDMMYY");

  orderCount += 1;

  const orderNumber = `ORDER-${customerId}-${formattedDate}-${String(
    orderCount
  ).padStart(5, "0")}`;

  return orderNumber;
};

const saveOrderData = async (
  orderNumber: string,
  data: any,
  retries: number = 3
): Promise<boolean> => {
  try {
    await fs.mkdir(orderStoragePath, { recursive: true });

    const filePath = path.join(orderStoragePath, `${orderNumber}.json`);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return true;
  } catch (error) {
    console.error(`Error saving order data: ${(error as Error).message}`);

    if (retries > 0) {
      return saveOrderData(orderNumber, data, retries - 1);
    }

    return false;
  }
};

app.post("/order/:id", async (req: Request, res: Response) => {
  await delay(3000);

  const { name, email, address, payment_type, items } = req.body;

  const id_customer = parseInt(req.params.id);

  const orderNumber = generateOrderNumber(id_customer);

  const total = items.reduce(
    (acc: number, item: any) => acc + item.price * item.qty,
    0
  );

  const orderData = {
    no_order: orderNumber,
    id_customer,
    name,
    email,
    address,
    payment_type,
    items,
    total,
    status: "Order Diterima",
  };

  const saved = await saveOrderData(orderNumber, orderData);
  if (saved) {
    res.status(201).json({
      message: "Order berhasil diproses",
      result: {
        order_number: orderData.no_order,
      },
    });
  } else {
    res
      .status(500)
      .json({ message: "Failed to save order data after multiple attempts." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// {
//   "address": "Test Address",
//   "payment_type": "Transfer",
//   "items": [
//     "id_product": 1,
//     "name": "Lorem Ipsum",
//     "price": 5000,
//     "qty": 1,
//   ]
// }

// {
//   "no_order": "ORDER-1-011224-00001",
//   "id_customer": 1,
//   "name": "John Doe",
//   "email": "jhon.doe@gmail.com",
//   "address": "Test Address",
//   "payment_type": "Transfer",
//   "items": [
//     {
//       "id_product": 1,
//       "name": "Lorem Ipsum",
//       "price": 5000,
//       "qty": 2
//     }
//   ],
//   "total": 10000,
//   "status": "Order Diterima"
// }
