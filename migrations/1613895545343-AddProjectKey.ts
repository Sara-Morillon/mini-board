import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProjectKey1613895545343 implements MigrationInterface {
    name = 'AddProjectKey1613895545343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "key" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_project"("id", "name", "description", "createdAt", "updatedAt") SELECT "id", "name", "description", "createdAt", "updatedAt" FROM "project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`ALTER TABLE "temporary_project" RENAME TO "project"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" RENAME TO "temporary_project"`);
        await queryRunner.query(`CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "project"("id", "name", "description", "createdAt", "updatedAt") SELECT "id", "name", "description", "createdAt", "updatedAt" FROM "temporary_project"`);
        await queryRunner.query(`DROP TABLE "temporary_project"`);
    }

}
