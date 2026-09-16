import dayjs from "dayjs";

// date format function (DD/MM/YYYY HH:mm:ss)
export const formatDate = (dateString) => {
  return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
};

// date format function (DD/MM/YYYY)
export const formatDateOnly = (dateString) => {
  return dayjs(dateString).format("DD/MM/YYYY");
};
