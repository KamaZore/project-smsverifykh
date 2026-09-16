import db from "./config/database.js";

await db.query(
  "UPDATE app_settings SET setting_value = ? WHERE setting_key = ?",
  ["KJBJFX7ASYDMDLG6TJ7VJKFQH7BPRSNH", "hero_sms_api_key"],
);

console.log("DB updated successfully");

const [rows] = await db.query(
  "SELECT setting_key, setting_value FROM app_settings WHERE setting_key = ?",
  ["hero_sms_api_key"],
);
console.log("Current value:", rows[0]?.setting_value);

await db.end();
