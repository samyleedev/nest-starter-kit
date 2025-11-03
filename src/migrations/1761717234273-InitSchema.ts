import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1761717234273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
          CREATE TYPE "userrole" AS ENUM ('ADMIN', 'USER');
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL UNIQUE,
        "username" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "roles" "userrole" NOT NULL DEFAULT 'USER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "userrole";`);
  }
}
