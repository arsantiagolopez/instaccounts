import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPreferencesEntity1655316983912 implements MigrationInterface {
    name = 'AddPreferencesEntity1655316983912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashtags" character varying array NOT NULL, "competitors" character varying array NOT NULL, "locations" character varying array NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "instagrams" ADD "preferencesId" uuid`);
        await queryRunner.query(`ALTER TABLE "instagrams" ADD CONSTRAINT "UQ_4b5a085fab809c381c442051a52" UNIQUE ("preferencesId")`);
        await queryRunner.query(`ALTER TABLE "instagrams" ALTER COLUMN "lastActive" SET DEFAULT '"2022-06-15T18:16:23.951Z"'`);
        await queryRunner.query(`ALTER TABLE "instagrams" ADD CONSTRAINT "FK_4b5a085fab809c381c442051a52" FOREIGN KEY ("preferencesId") REFERENCES "preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "instagrams" DROP CONSTRAINT "FK_4b5a085fab809c381c442051a52"`);
        await queryRunner.query(`ALTER TABLE "instagrams" ALTER COLUMN "lastActive" SET DEFAULT '2021-12-13 18:23:37.374'`);
        await queryRunner.query(`ALTER TABLE "instagrams" DROP CONSTRAINT "UQ_4b5a085fab809c381c442051a52"`);
        await queryRunner.query(`ALTER TABLE "instagrams" DROP COLUMN "preferencesId"`);
        await queryRunner.query(`DROP TABLE "preferences"`);
    }

}
