import db from "../config/database.js";

// In-process cache so hot paths (every HERO SMS call) don't hit MySQL.
const cache = new Map();

export const SETTING_KEYS = {
  HERO_SMS_API_KEY: "hero_sms_api_key",
  HERO_SMS_ACCOUNT_ID: "hero_sms_account_id",
  HERO_SMS_EMAIL: "hero_sms_email",
  HERO_SMS_USERNAME: "hero_sms_username",
  HERO_SMS_PASSWORD: "hero_sms_password",
};

export async function getSetting(key) {
  if (cache.has(key)) return cache.get(key);
  const [rows] = await db.query(
    "SELECT setting_value FROM app_settings WHERE setting_key = ?",
    [key],
  );
  const dbValue = rows.length > 0 ? rows[0].setting_value : null;
  const envKey = ENV_KEY_MAP[key];
  const value = dbValue || (envKey ? process.env[envKey] : null) || null;
  cache.set(key, value);
  return value;
}

const ENV_KEY_MAP = {
  [SETTING_KEYS.HERO_SMS_API_KEY]: "HERO_SMS_API_KEY",
  [SETTING_KEYS.HERO_SMS_ACCOUNT_ID]: "HERO_SMS_ACCOUNT_ID",
  [SETTING_KEYS.HERO_SMS_EMAIL]: "HERO_SMS_EMAIL",
  [SETTING_KEYS.HERO_SMS_USERNAME]: "HERO_SMS_USERNAME",
  [SETTING_KEYS.HERO_SMS_PASSWORD]: "HERO_SMS_PASSWORD",
};

export async function setSetting(key, value) {
  await db.query(
    "INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
    [key, value],
  );
  cache.set(key, value);

  // Persist to .env file so the value survives restarts
  const envKey = ENV_KEY_MAP[key];
  if (envKey) {
    await writeEnvKey(envKey, value);
    process.env[envKey] = value;
  }

  return value;
}

/** Persist a setting value into the .env file (currently only HERO_SMS_API_KEY). */
async function writeEnvKey(key, value) {
  const fs = await import("fs/promises");
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const envPath = path.resolve(__dirname, "../../.env");
  let content = await fs.readFile(envPath, "utf8");
  const regex = new RegExp(`^${key}=.*`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}\n`;
  }
  await fs.writeFile(envPath, content);
}

/** Drop cached values (e.g. after an external DB edit). */
export function clearCache(key) {
  if (key) cache.delete(key);
  else cache.clear();
}
