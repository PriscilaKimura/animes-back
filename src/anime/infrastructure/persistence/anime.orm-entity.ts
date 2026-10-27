import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { AnimeType } from '../../domain/anime';

@Entity({ tableName: 'animes' })
export class AnimeOrmEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ length: 255 })
  title: string;

  @Property({ type: 'text' })
  description: string;

  @Property()
  completed: boolean;

  @Property({ type: 'date' })
  releaseDate: string;

  @Property({ length: 20, nullable: true })
  type?: AnimeType;

  @Property({ type: 'text', nullable: true })
  imageUrl?: string;

  @Property({ type: 'int', nullable: true })
  ranking?: number;

  @Property({ columnType: 'timestamptz' })
  createdAt: Date = new Date();

  @Property({ columnType: 'timestamptz', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
