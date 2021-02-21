import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProjectKey1613895545343 implements MigrationInterface {
  name = 'AddProjectKey1613895545343'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `project` ADD COLUMN `key` varchar(10) DEFAULT NULL AFTER `id`')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `project` DROP COLUMN `key`')
  }
}
