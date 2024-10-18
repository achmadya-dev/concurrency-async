import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export const generateOrderNumber = (id_customer: string) => {
  const date = moment().format("DDMMYY");
  const uniqueId = uuidv4().slice(0, 5);
  return `ORDER-${id_customer}-${date}-${uniqueId}`;
};
