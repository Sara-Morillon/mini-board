import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddProjects1612461051323 implements MigrationInterface {
  name = 'AddProjects1612461051323'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`
    )
    await queryRunner.query(
      `CREATE TABLE "release" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "dueDate" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL, CONSTRAINT "FK_f47da974d2cab31cfa0ce0d812e" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `CREATE TABLE "issue" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "type" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('to do'), "priority" integer NOT NULL DEFAULT (0), "points" integer NOT NULL DEFAULT (0), "title" varchar NOT NULL, "description" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer NOT NULL, "authorId" integer NOT NULL, "releaseId" integer NOT NULL, CONSTRAINT "FK_be30b91466b730c5e25f1181f79" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_0afd9b73442e8fcc3c2d13007b6" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION, CONSTRAINT "FK_168f3ee7d0a35d31343f583eaeb" FOREIGN KEY ("releaseId") REFERENCES "release" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `CREATE TABLE "attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "filename" varchar NOT NULL, "filepath" varchar NOT NULL, "mime" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "issueId" integer NOT NULL, CONSTRAINT "FK_54f51431f696f4d3b8436475e88" FOREIGN KEY ("issueId") REFERENCES "issue" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
    )
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "issueId" integer NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "FK_c91b5a63310845bdeca63d9ee13" FOREIGN KEY ("issueId") REFERENCES "issue" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "comment"`)
    await queryRunner.query(`DROP TABLE "attachment"`)
    await queryRunner.query(`DROP TABLE "issue"`)
    await queryRunner.query(`DROP TABLE "release"`)
    await queryRunner.query(`DROP TABLE "project"`)
  }
}
