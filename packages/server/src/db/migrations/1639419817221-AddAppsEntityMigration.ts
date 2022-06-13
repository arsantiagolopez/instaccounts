import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAppsEntityMigration1639419817221 implements MigrationInterface {
    name = 'AddAppsEntityMigration1639419817221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "apps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, CONSTRAINT "UQ_c1a24df1d51c2748d97561b77da" UNIQUE ("name"), CONSTRAINT "PK_c5121fda0f8268f1f7f84134e19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "instagrams" ALTER COLUMN "lastActive" SET DEFAULT '"2021-12-13T18:23:37.374Z"'`);
        await queryRunner.query(`ALTER TABLE "apps" ADD CONSTRAINT "FK_d8399f3dc634c809819e7441898" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "apps" DROP CONSTRAINT "FK_d8399f3dc634c809819e7441898"`);
        await queryRunner.query(`ALTER TABLE "instagrams" ALTER COLUMN "lastActive" SET DEFAULT '2021-12-13 16:48:13.837'`);
        await queryRunner.query(`DROP TABLE "apps"`);
    }

}
