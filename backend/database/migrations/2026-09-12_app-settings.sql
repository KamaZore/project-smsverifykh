-- ────────────────────────────────────────────────────────────────
-- Migration: App settings (admin-managed key/value store)
-- Adds the `app_settings` table used for runtime-managed settings
-- such as the HERO SMS API key (Settings › API Key page).
-- Run ONCE. Fresh installs: schema.sql already includes this table.
-- ────────────────────────────────────────────────────────────────
USE `smsverify-kh`;

CREATE TABLE IF NOT EXISTS `app_settings` (
  `setting_key`    VARCHAR(100) NOT NULL,
  `setting_value`  TEXT DEFAULT NULL,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB;
