import db from "../config/database.js";
import * as heroSms from "./hero-sms.service.js";
import { BadRequestError, NotFoundError } from "../errors/AppError.js";

export async function rentNumber(userId, service, country, options = {}) {
  const result = await heroSms.getNumber(service, country, options);

  if (typeof result === "string" && result.startsWith("ACCESS_NUMBER")) {
    const parts = result.split(":");
    const heroActivationId = parts[1];
    const phoneNumber = parts[2];

    const [dbResult] = await db.query(
      `INSERT INTO activations (user_id, hero_activation_id, phone_number, service_code, country_code, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [userId, heroActivationId, phoneNumber, service, country]
    );

    return {
      activationId: dbResult.insertId,
      heroActivationId,
      phoneNumber,
      service,
      country,
    };
  }

  return result;
}

export async function getActivationStatus(userId, activationId) {
  const [rows] = await db.query(
    "SELECT * FROM activations WHERE id = ? AND user_id = ?",
    [activationId, userId]
  );
  if (rows.length === 0) throw new NotFoundError("Activation not found");

  const activation = rows[0];

  if (activation.hero_activation_id && activation.status === "pending") {
    try {
      const status = await heroSms.getStatus(activation.hero_activation_id);
      if (typeof status === "string" && status.startsWith("STATUS_OK")) {
        const smsCode = status.split(":")[1];
        await db.query(
          "UPDATE activations SET sms_code = ?, status = 'sms_received' WHERE id = ?",
          [smsCode, activationId]
        );
        activation.sms_code = smsCode;
        activation.status = "sms_received";
      }
    } catch {
      // HERO SMS API error, return current DB status
    }
  }

  return activation;
}

export async function getActiveActivations(userId) {
  const [rows] = await db.query(
    "SELECT * FROM activations WHERE user_id = ? AND status IN ('pending', 'sms_received') ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

export async function getActivationHistory(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    "SELECT * FROM activations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, limit, offset]
  );
  const [countResult] = await db.query(
    "SELECT COUNT(*) as total FROM activations WHERE user_id = ?",
    [userId]
  );
  return { data: rows, total: countResult[0].total, page, limit };
}

export async function cancelActivation(userId, activationId) {
  const [rows] = await db.query(
    "SELECT * FROM activations WHERE id = ? AND user_id = ? AND status = 'pending'",
    [activationId, userId]
  );
  if (rows.length === 0) throw new NotFoundError("Activation not found or not cancelable");

  const activation = rows[0];
  if (activation.hero_activation_id) {
    await heroSms.setStatus(activation.hero_activation_id, "refuse");
  }

  await db.query("UPDATE activations SET status = 'expired' WHERE id = ?", [activationId]);
  return { message: "Activation cancelled" };
}
