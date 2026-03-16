-- AlterTable
ALTER TABLE `llm_settings` ADD COLUMN `categoryEnabled` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `translateEnabled` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `geminiModel` VARCHAR(191) NOT NULL DEFAULT 'gemini-2.5-flash-lite';
