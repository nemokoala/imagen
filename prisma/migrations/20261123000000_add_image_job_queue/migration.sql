-- AlterTable
ALTER TABLE `Notification` MODIFY `actorId` INTEGER NULL,
    MODIFY `type` ENUM('LIKE', 'COMMENT', 'GENERATION_DONE', 'GENERATION_FAILED') NOT NULL;

-- CreateTable
CREATE TABLE `ImageJob` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `prompt` TEXT NOT NULL,
    `ratio` VARCHAR(191) NOT NULL,
    `categorySlugs` JSON NULL,
    `creditCost` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `externalId` VARCHAR(191) NULL,
    `progress` VARCHAR(255) NULL,
    `error` VARCHAR(255) NULL,
    `notifyOnFinish` BOOLEAN NOT NULL DEFAULT false,
    `imageId` INTEGER NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ImageJob_imageId_key`(`imageId`),
    INDEX `ImageJob_status_id_idx`(`status`, `id`),
    INDEX `ImageJob_userId_status_idx`(`userId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageJob` ADD CONSTRAINT `ImageJob_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageJob` ADD CONSTRAINT `ImageJob_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `GeneratedImage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

