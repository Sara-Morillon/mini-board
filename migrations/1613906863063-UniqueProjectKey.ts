import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqueProjectKey1613906863063 implements MigrationInterface {
    name = 'UniqueProjectKey1613906863063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `project` CHANGE `key` `key` varchar(10) NOT NULL");
        await queryRunner.query("ALTER TABLE `project` ADD UNIQUE INDEX `IDX_2db22c052f9ffdd51a6c113b37` (`key`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `project` DROP INDEX `IDX_2db22c052f9ffdd51a6c113b37`");
        await queryRunner.query("ALTER TABLE `project` CHANGE `key` `key` varchar(10) NULL");
    }

}
