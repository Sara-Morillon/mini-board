/*
  Warnings:

  - You are about to drop the column `projectId` on the `release` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `release` DROP FOREIGN KEY `fk_release_project_id`;

-- AlterTable
ALTER TABLE `release` DROP COLUMN `projectId`;
