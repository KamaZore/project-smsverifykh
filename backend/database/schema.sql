CREATE DATABASE IF NOT EXISTS `smsverify-kh`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `smsverify-kh`;

-- ─── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)  NOT NULL,
  `email`         VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `balance`       DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  `status`        ENUM('active','suspended','banned') NOT NULL DEFAULT 'active',
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB;

-- ─── Activations (phone number rentals) ───────────────────
CREATE TABLE IF NOT EXISTS `activations` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`         INT UNSIGNED NOT NULL,
  `hero_activation_id` VARCHAR(50)  DEFAULT NULL COMMENT 'ID from HERO SMS API',
  `phone_number`    VARCHAR(20)  DEFAULT NULL,
  `service_code`    VARCHAR(20)  NOT NULL,
  `country_code`    VARCHAR(10)  NOT NULL,
  `status`          ENUM('pending','sms_received','completed','expired','refunded') NOT NULL DEFAULT 'pending',
  `sms_code`        VARCHAR(20)  DEFAULT NULL,
  `cost`            DECIMAL(12,4) DEFAULT NULL,
  `provider_id`     INT UNSIGNED DEFAULT NULL,
  `activation_type` VARCHAR(20)  NOT NULL DEFAULT 'SMS',
  `expires_at`      TIMESTAMP NULL DEFAULT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activations_user` (`user_id`),
  KEY `idx_activations_status` (`status`),
  KEY `idx_activations_hero_id` (`hero_activation_id`),
  CONSTRAINT `fk_activations_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Transactions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `transactions` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`         INT UNSIGNED NOT NULL,
  `type`            ENUM('deposit','withdrawal','activation_purchase','refund') NOT NULL,
  `amount`          DECIMAL(12,4) NOT NULL,
  `balance_after`   DECIMAL(12,4) NOT NULL,
  `reference_id`    INT UNSIGNED DEFAULT NULL COMMENT 'activation_id if related',
  `description`     VARCHAR(255) DEFAULT NULL,
  `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tx_user` (`user_id`),
  KEY `idx_tx_type` (`type`),
  CONSTRAINT `fk_tx_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Service Pricing Cache ────────────────────────────────
CREATE TABLE IF NOT EXISTS `service_prices` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `service_code`    VARCHAR(20)  NOT NULL,
  `country_code`    VARCHAR(10)  NOT NULL,
  `default_price`   DECIMAL(12,4) NOT NULL,
  `min_price`       DECIMAL(12,4) NOT NULL,
  `avg_price`       DECIMAL(12,4) NOT NULL,
  `retail_price`    DECIMAL(12,4) NOT NULL,
  `total_count`     INT UNSIGNED NOT NULL DEFAULT 0,
  `price_buckets`   JSON DEFAULT NULL,
  `fetched_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_price_service_country` (`service_code`, `country_code`)
) ENGINE=InnoDB;

-- ─── Audit Log ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED DEFAULT NULL,
  `action`      VARCHAR(50)  NOT NULL,
  `details`     JSON DEFAULT NULL,
  `ip_address`  VARCHAR(45)  DEFAULT NULL,
  `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user` (`user_id`),
  KEY `idx_audit_action` (`action`)
) ENGINE=InnoDB;

-- ─── App Settings (key/value, admin-managed) ──────────────
CREATE TABLE IF NOT EXISTS `app_settings` (
  `setting_key`    VARCHAR(100) NOT NULL,
  `setting_value`  TEXT DEFAULT NULL,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB;

