import dayjs from "dayjs";

export const getToday = (format: string = "DD MMM YYYY") => {
  return dayjs().format(format).toString();
};
