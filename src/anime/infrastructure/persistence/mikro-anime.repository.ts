import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Anime, AnimeData } from '../../domain/anime';
import { AnimeRepository } from '../../domain/anime.repository';
import { AnimeOrmEntity } from './anime.orm-entity';

@Injectable()
export class MikroAnimeRepository implements AnimeRepository {
  constructor(
    @InjectRepository(AnimeOrmEntity)
    private readonly repository: EntityRepository<AnimeOrmEntity>,
  ) {}

  async findAll(): Promise<Anime[]> {
    const rows = await this.repository.findAll({
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toAnime);
  }

  async findById(id: string): Promise<Anime | null> {
    const entity = await this.repository.findOne({ id });
    return entity ? toAnime(entity) : null;
  }

  async create(data: AnimeData): Promise<Anime> {
    const entity = this.repository.create({
      title: data.title,
      description: data.description,
      completed: data.completed,
      releaseDate: data.releaseDate,
      type: data.type,
      imageUrl: data.imageUrl,
      ranking: data.ranking,
    });
    await this.repository.getEntityManager().persistAndFlush(entity);
    return toAnime(entity);
  }

  async update(id: string, data: Partial<AnimeData>): Promise<Anime | null> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return null;
    }

    if (data.title !== undefined) entity.title = data.title;
    if (data.description !== undefined) entity.description = data.description;
    if (data.completed !== undefined) entity.completed = data.completed;
    if (data.releaseDate !== undefined) entity.releaseDate = data.releaseDate;
    if (data.type !== undefined) entity.type = data.type;
    if (data.imageUrl !== undefined) entity.imageUrl = data.imageUrl;
    if (data.ranking !== undefined) entity.ranking = data.ranking;
    entity.updatedAt = new Date();

    await this.repository.getEntityManager().flush();
    return toAnime(entity);
  }

  async remove(id: string): Promise<boolean> {
    const entity = await this.repository.findOne({ id });
    if (!entity) {
      return false;
    }
    await this.repository.getEntityManager().removeAndFlush(entity);
    return true;
  }
}

function toAnime(entity: AnimeOrmEntity): Anime {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    completed: entity.completed,
    releaseDate: asDateOnly(entity.releaseDate),
    type: entity.type ?? undefined,
    imageUrl: entity.imageUrl ?? undefined,
    ranking: entity.ranking ?? undefined,
  };
}

function asDateOnly(value: string | Date): string {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return value.slice(0, 10);
}
