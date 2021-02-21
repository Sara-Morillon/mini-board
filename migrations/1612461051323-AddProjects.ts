import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProjects1612461051323 implements MigrationInterface {
  name = 'AddProjects1612461051323'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `project` (`id` int(11) NOT NULL AUTO_INCREMENT,`name` varchar(40) NOT NULL,`description` text NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY (`id`)) ENGINE = InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `release` (`id` int(11) NOT NULL AUTO_INCREMENT,`projectId` int NOT NULL,`name` varchar(40) NOT NULL,`dueDate` datetime NOT NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY (`id`),FOREIGN KEY (`projectId`) REFERENCES `project`(`id`)) ENGINE = InnoDB'
    )
    await queryRunner.query(
      "CREATE TABLE `issue` (`id` int(11) NOT NULL AUTO_INCREMENT,`projectId` int(11) NOT NULL,`releaseId` int(11) NOT NULL,`authorId` int(11) NOT NULL,`type` ENUM('bug', 'feature') NOT NULL,`status` ENUM('to do', 'doing', 'done') NOT NULL DEFAULT 'to do',`priority` int(11) NOT NULL DEFAULT 0,`points` int(11) NOT NULL DEFAULT 0,`title` varchar(100) NOT NULL,`description` text NOT NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY (`id`),FOREIGN KEY (`projectId`) REFERENCES `project`(`id`),FOREIGN KEY (`releaseId`) REFERENCES `release`(`id`),FOREIGN KEY (`authorId`) REFERENCES `user`(`id`)) ENGINE = InnoDB"
    )
    await queryRunner.query(
      'CREATE TABLE `attachment` (`id` int(11) NOT NULL AUTO_INCREMENT,`issueId` int(11) NOT NULL,`filename` varchar(255) NOT NULL,`filepath` varchar(255) NOT NULL,`mime` varchar(255) NOT NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY (`id`),FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`)) ENGINE = InnoDB'
    )
    await queryRunner.query(
      'CREATE TABLE `comment` (`id` int(11) NOT NULL AUTO_INCREMENT,`issueId` int(11) NOT NULL,`authorId` int(11) NOT NULL,`content` text NOT NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY (`id`),FOREIGN KEY (`issueId`) REFERENCES `issue`(`id`),FOREIGN KEY (`authorId`) REFERENCES `user`(`id`)) ENGINE = InnoDB'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `comment`')
    await queryRunner.query('DROP TABLE `attachment`')
    await queryRunner.query('DROP TABLE `issue`')
    await queryRunner.query('DROP TABLE `release`')
    await queryRunner.query('DROP TABLE `project`')
  }
}
