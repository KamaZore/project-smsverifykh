import winston from "winston";
import env from "../config/env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp: ts, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} [${level}]: ${message}${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), json());

const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "src/log/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "src/log/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
