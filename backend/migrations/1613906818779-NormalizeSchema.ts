import {MigrationInterface, QueryRunner} from "typeorm";

export class NormalizeSchema1613906818779 implements MigrationInterface {
    name = 'NormalizeSchema1613906818779'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_1`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_2`");
        await queryRunner.query("ALTER TABLE `release` DROP FOREIGN KEY `release_ibfk_1`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `issue_ibfk_1`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `issue_ibfk_2`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `issue_ibfk_3`");
        await queryRunner.query("ALTER TABLE `attachment` DROP FOREIGN KEY `attachment_ibfk_1`");
        await queryRunner.query("DROP INDEX `user_username` ON `user`");
        await queryRunner.query("DROP INDEX `authorId` ON `comment`");
        await queryRunner.query("DROP INDEX `issueId` ON `comment`");
        await queryRunner.query("DROP INDEX `projectId` ON `release`");
        await queryRunner.query("DROP INDEX `authorId` ON `issue`");
        await queryRunner.query("DROP INDEX `projectId` ON `issue`");
        await queryRunner.query("DROP INDEX `releaseId` ON `issue`");
        await queryRunner.query("DROP INDEX `issueId` ON `attachment`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `username` `username` varchar(40) NOT NULL");
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_78a916df40e02a9deb1c4b75ed` (`username`)");
        await queryRunner.query("ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `comment` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `comment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `release` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `release` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `project` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `project` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `issue` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `issue` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `attachment` CHANGE `createdAt` `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `attachment` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_c91b5a63310845bdeca63d9ee13` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_276779da446413a0d79598d4fbd` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `release` ADD CONSTRAINT `FK_f47da974d2cab31cfa0ce0d812e` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `FK_be30b91466b730c5e25f1181f79` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `FK_0afd9b73442e8fcc3c2d13007b6` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `FK_168f3ee7d0a35d31343f583eaeb` FOREIGN KEY (`releaseId`) REFERENCES `release`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `attachment` ADD CONSTRAINT `FK_54f51431f696f4d3b8436475e88` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `attachment` DROP FOREIGN KEY `FK_54f51431f696f4d3b8436475e88`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `FK_168f3ee7d0a35d31343f583eaeb`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `FK_0afd9b73442e8fcc3c2d13007b6`");
        await queryRunner.query("ALTER TABLE `issue` DROP FOREIGN KEY `FK_be30b91466b730c5e25f1181f79`");
        await queryRunner.query("ALTER TABLE `release` DROP FOREIGN KEY `FK_f47da974d2cab31cfa0ce0d812e`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_276779da446413a0d79598d4fbd`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_c91b5a63310845bdeca63d9ee13`");
        await queryRunner.query("ALTER TABLE `attachment` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `attachment` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `issue` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `issue` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `project` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `project` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `release` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `release` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `comment` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `comment` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `user` CHANGE `updatedAt` `updatedAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `user` CHANGE `createdAt` `createdAt` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_78a916df40e02a9deb1c4b75ed`");
        await queryRunner.query("ALTER TABLE `user` CHANGE `username` `username` varchar(40) NOT NULL");
        await queryRunner.query("CREATE INDEX `issueId` ON `attachment` (`issueId`)");
        await queryRunner.query("CREATE INDEX `releaseId` ON `issue` (`releaseId`)");
        await queryRunner.query("CREATE INDEX `projectId` ON `issue` (`projectId`)");
        await queryRunner.query("CREATE INDEX `authorId` ON `issue` (`authorId`)");
        await queryRunner.query("CREATE INDEX `projectId` ON `release` (`projectId`)");
        await queryRunner.query("CREATE INDEX `issueId` ON `comment` (`issueId`)");
        await queryRunner.query("CREATE INDEX `authorId` ON `comment` (`authorId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `user_username` ON `user` (`username`)");
        await queryRunner.query("ALTER TABLE `attachment` ADD CONSTRAINT `attachment_ibfk_1` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `issue_ibfk_3` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `issue_ibfk_2` FOREIGN KEY (`releaseId`) REFERENCES `release`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `issue` ADD CONSTRAINT `issue_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `release` ADD CONSTRAINT `release_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
