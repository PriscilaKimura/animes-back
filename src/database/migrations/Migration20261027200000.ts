import { Migration } from '@mikro-orm/migrations';

export class Migration20261027200000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table "animes" (
        "id" uuid not null,
        "title" varchar(255) not null,
        "description" text not null,
        "completed" boolean not null,
        "release_date" date not null,
        "type" varchar(20) null,
        "image_url" varchar(500) null,
        "ranking" int null,
        "created_at" timestamptz not null,
        "updated_at" timestamptz not null,
        constraint "animes_pkey" primary key ("id")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "animes";');
  }
}
