import {MigrationInterface, QueryRunner} from "typeorm";

export class InitMigration1639017682098 implements MigrationInterface {
    name = 'InitMigration1639017682098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionToken" character varying NOT NULL, "expires" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_8b5e2ec52e335c0fe16d7ec3584" UNIQUE ("sessionToken"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "identifier" character varying NOT NULL, "expires" character varying NOT NULL, CONSTRAINT "PK_f2d4d7a2aa57ef199e61567db22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "height" integer NOT NULL, "width" integer NOT NULL, "image" character varying NOT NULL, "caption" character varying, "location" character varying, "comments" integer NOT NULL, "likes" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, "isCarousel" boolean NOT NULL DEFAULT false, "carouselImages" character varying array, "instagramId" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instagrams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying, "bio" character varying, "followers" integer, "following" integer, "image" character varying, "isAuthorized" boolean NOT NULL DEFAULT false, "lastActive" TIMESTAMP NOT NULL DEFAULT '"2021-12-09T02:41:22.176Z"', "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" uuid NOT NULL, CONSTRAINT "UQ_3872b9bb9ab4f559ae804ba1ffb" UNIQUE ("username"), CONSTRAINT "PK_789f88587deb394e1d16929601a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "emailVerified" character varying, "image" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "provider" character varying NOT NULL, "providerAccountId" character varying NOT NULL, "refresh_token" character varying, "access_token" character varying, "expires_at" bigint, "token_type" character varying, "scope" character varying, "id_token" character varying, "session_state" character varying, "oauth_token_secret" character varying, "oauth_token" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_dbc8cc8dff11ad1f45d97c1b9bf" FOREIGN KEY ("instagramId") REFERENCES "instagrams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instagrams" ADD CONSTRAINT "FK_d4bdadcbf0da58fe8d93ccf91f0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3aa23c0a6d107393e8b40e3e2a6"`);
        await queryRunner.query(`ALTER TABLE "instagrams" DROP CONSTRAINT "FK_d4bdadcbf0da58fe8d93ccf91f0"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_dbc8cc8dff11ad1f45d97c1b9bf"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "instagrams"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "verification_tokens"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
    }

}
