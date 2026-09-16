import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../../.env") });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  HERO_SMS_BASE_URL: process.env.HERO_SMS_BASE_URL || "https://hero-sms.com",
  HERO_SMS_API_KEY: process.env.HERO_SMS_API_KEY || "",
  HERO_SMS_ACCOUNT_ID: process.env.HERO_SMS_ACCOUNT_ID || "",
  HERO_SMS_EMAIL: process.env.HERO_SMS_EMAIL || "",
  HERO_SMS_USERNAME: process.env.HERO_SMS_USERNAME || "",
  HERO_SMS_PASSWORD: process.env.HERO_SMS_PASSWORD || "",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "smsverify-kh",

  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};

export default env;
