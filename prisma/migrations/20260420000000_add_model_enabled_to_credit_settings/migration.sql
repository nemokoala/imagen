ALTER TABLE `credit_settings`
  ADD COLUMN `dallE3Enabled` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `stableDiffusionXlEnabled` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `googleImagenEnabled` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `nanoBananaEnabled` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `zImageEnabled` BOOLEAN NOT NULL DEFAULT true;
