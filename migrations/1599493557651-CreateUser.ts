import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUser1599493557651 implements MigrationInterface {
  name = 'CreateUser1599493557651'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `user` (`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(40) NOT NULL,`password` char(64) NOT NULL,`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,UNIQUE INDEX `user_username` (`username`),PRIMARY KEY (`id`)) ENGINE = InnoDB'
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user`')
  }
}
