import { forEach, random } from "lodash";
import { env } from "../../config/config";
import dayjs from "dayjs";

export const getDomainForCookie = () =>
  env === "development" ? "localhost" : "manubrothers.com";

export const setCookie = (
  res: any | any,
  name: string,
  value: any
) => {
  return res.cookie(name, value, {
    expires: dayjs().add(60, "days").toDate(),
    domain: getDomainForCookie(),
  });
};

export const generateRandomElementFromArray = (arr: any[]) => {
  const length = arr.length - 1;
  return arr[random(0, length, false)];
};

export const clearKeysAndAppendObject = (obj: any, key: string, value: any) => {
  forEach(Object.keys(obj), (key) => {
    obj[key] = undefined;
  });
  obj[key] = value;
};
