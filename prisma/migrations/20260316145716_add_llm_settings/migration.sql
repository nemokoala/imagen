-- CreateTable
CREATE TABLE `llm_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `provider` VARCHAR(191) NOT NULL DEFAULT 'ollama',
    `geminiModel` VARCHAR(191) NOT NULL DEFAULT 'gemini-2.0-flash-lite',
    `ollamaModel` VARCHAR(191) NOT NULL DEFAULT 'gemma3:4b',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
