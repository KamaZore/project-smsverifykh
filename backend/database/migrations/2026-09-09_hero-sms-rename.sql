-- ────────────────────────────────────────────────────────────────
-- Migration: HERO SMS rename (Tiger SMS -> HERO SMS)
-- Run ONCE on existing databases that were created from the old schema.
-- New / fresh installs can use backend/database/schema.sql directly.
-- ────────────────────────────────────────────────────────────────
USE `smsverify-kh`;

-- 1) Drop the old index on the column being renamed
ALTER TABLE `activations`
  DROP INDEX `idx_activations_tiger_id`;

-- 2) Rename the column and update the comment
ALTER TABLE `activations`
  CHANGE COLUMN `tiger_activation_id` `hero_activation_id` VARCHAR(50) DEFAULT NULL COMMENT 'ID from HERO SMS API';

-- 3) Recreate the index with the new name
ALTER TABLE `activations`
  ADD INDEX `idx_activations_hero_id` (`hero_activation_id`);