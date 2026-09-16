-- ────────────────────────────────────────────────────────────────
-- Migration: Admin users (admin panel login)
-- Creates the `admin_users` table used by src/services/admin.service.js
-- and seeds a default superadmin account.
--
-- Default credentials: admin / admin123
-- (CHANGE THE PASSWORD AFTER FIRST LOGIN!)
--
-- Run ONCE on existing databases. New installs: schema.sql + this file.
-- ────────────────────────────────────────────────────────────────
USE `smsverify-kh`;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('superadmin','admin') NOT NULL DEFAULT 'admin',
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_username` (`username`)
) ENGINE=InnoDB;

-- Seed the default superadmin account (idempotent)
INSERT INTO `admin_users` (`username`, `password_hash`, `role`)
VALUES ('admin', '$2b$12$c5KeXrOo0c0Bl6XO7Kwtm.7xinAJxrILBZ.fIKfVI15GxU9VoL75W', 'superadmin')
ON DUPLICATE KEY UPDATE `role` = `role`;