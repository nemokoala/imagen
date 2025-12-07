-- CreateTable
CREATE TABLE `ImageLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ImageLike_imageId_idx`(`imageId`),
    INDEX `ImageLike_userId_idx`(`userId`),
    UNIQUE INDEX `ImageLike_userId_imageId_key`(`userId`, `imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `imageId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `parentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ImageComment_imageId_idx`(`imageId`),
    INDEX `ImageComment_userId_idx`(`userId`),
    INDEX `ImageComment_parentId_idx`(`parentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ImageLike` ADD CONSTRAINT `ImageLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageLike` ADD CONSTRAINT `ImageLike_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `GeneratedImage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageComment` ADD CONSTRAINT `ImageComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageComment` ADD CONSTRAINT `ImageComment_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `GeneratedImage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageComment` ADD CONSTRAINT `ImageComment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ImageComment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
