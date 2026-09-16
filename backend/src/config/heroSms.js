import env from "./env.js";

const heroSmsConfig = {
  baseUrl: env.HERO_SMS_BASE_URL,
  apiKey: env.HERO_SMS_API_KEY,
  accountId: env.HERO_SMS_ACCOUNT_ID,
  email: env.HERO_SMS_EMAIL,
  username: env.HERO_SMS_USERNAME,
  password: env.HERO_SMS_PASSWORD,
  timeout: 60000,
};

export default heroSmsConfig;