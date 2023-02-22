-- DropForeignKey
ALTER TABLE `attachment` DROP FOREIGN KEY `FK_54f51431f696f4d3b8436475e88`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `FK_276779da446413a0d79598d4fbd`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `FK_c91b5a63310845bdeca63d9ee13`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `FK_0afd9b73442e8fcc3c2d13007b6`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `FK_be30b91466b730c5e25f1181f79`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `FK_168f3ee7d0a35d31343f583eaeb`;

-- DropForeignKey
ALTER TABLE `release` DROP FOREIGN KEY `FK_f47da974d2cab31cfa0ce0d812e`;

-- AddForeignKey
ALTER TABLE `attachment` ADD CONSTRAINT `attachment_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `issue_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `issue_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `issue_releaseId_fkey` FOREIGN KEY (`releaseId`) REFERENCES `release`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `release` ADD CONSTRAINT `release_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `project` RENAME INDEX `IDX_2db22c052f9ffdd51a6c113b37` TO `project_key_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `IDX_78a916df40e02a9deb1c4b75ed` TO `user_username_key`;
