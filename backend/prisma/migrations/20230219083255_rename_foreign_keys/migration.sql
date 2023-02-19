-- DropForeignKey
ALTER TABLE `attachment` DROP FOREIGN KEY `attachment_issueId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_issueId_fkey`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `issue_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `issue_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `issue` DROP FOREIGN KEY `issue_releaseId_fkey`;

-- DropForeignKey
ALTER TABLE `release` DROP FOREIGN KEY `release_projectId_fkey`;

-- AddForeignKey
ALTER TABLE `release` ADD CONSTRAINT `fk_release_project_id` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `fk_issue_author_id` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `fk_issue_project_id` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `issue` ADD CONSTRAINT `fk_issue_release_id` FOREIGN KEY (`releaseId`) REFERENCES `release`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_author_id` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_issue_id` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachment` ADD CONSTRAINT `fk_attachment_issue_id` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
