import dayjs from "dayjs";
import { random } from "lodash";
import OrderModel from "./models/order.model";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

const generateRandom = () => {
  let ran = `${dayjs().get("year")}-`;
  for (let i = 0; i < 9; i++) {
    if (i === 4) ran += "-";
    else ran += chars[random(0, chars.length - 1, false)];
  }
  return ran;
};

export const generateOrderId: () => Promise<string | null> = async () => {
  let done = false;
  while (!done) {
    const ran = generateRandom();
    const order = await OrderModel.findOne({ orderNo: ran }).countDocuments();
    if (order === 0) {
      done = true;
      return ran;
    }
  }
  return null;
};
