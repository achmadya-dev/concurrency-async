import express from "express";
import { createOrder } from "./controller/order.controller";
import "./workers/delivered";
import "./workers/rekap";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/order/:id", createOrder);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
