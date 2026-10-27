import { Migration } from '@mikro-orm/migrations';

export class Migration20261027220000 extends Migration {
  override async up(): Promise<void> {
    this.addSql('alter table "animes" alter column "image_url" type text;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "animes" alter column "image_url" type varchar(500);');
  }
}