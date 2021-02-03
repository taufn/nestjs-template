import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1612340793195 implements MigrationInterface {
  name = "InitialMigration1612340793195";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "email" character varying NOT NULL,
        "password" character varying,
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TYPE "auth_providers_provider_type_enum" AS ENUM(
        'EMAIL',
        'SLACK'
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_providers" (
        "id" SERIAL NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "provider_type" "auth_providers_provider_type_enum" NOT NULL,
        "provider_key" character varying,
        "user_id" integer,
        CONSTRAINT "PK_cb277e892a115855fc95c373422" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_providers"
        ADD CONSTRAINT "FK_262996fd08ab5a69e85b53d0055"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_providers"
        DROP CONSTRAINT "FK_262996fd08ab5a69e85b53d0055"`,
    );
    await queryRunner.query(`DROP TABLE "auth_providers"`);
    await queryRunner.query(`DROP TYPE "auth_providers_provider_type_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
