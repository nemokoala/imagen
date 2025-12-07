-- CreateTable
CREATE TABLE `credit_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `dallE3` INTEGER NOT NULL DEFAULT 20,
    `stableDiffusionXl` INTEGER NOT NULL DEFAULT 5,
    `googleImagen` INTEGER NOT NULL DEFAULT 20,
    `nanoBanana` INTEGER NOT NULL DEFAULT 20,
    `zImage` INTEGER NOT NULL DEFAULT 10,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
