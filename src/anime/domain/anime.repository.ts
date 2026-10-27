import { Anime, AnimeData } from './anime';

export const ANIME_REPOSITORY = Symbol('ANIME_REPOSITORY');

export interface AnimeRepository {
  findAll(): Promise<Anime[]>;
  findById(id: string): Promise<Anime | null>;
  create(data: AnimeData): Promise<Anime>;
  update(id: string, data: Partial<AnimeData>): Promise<Anime | null>;
  remove(id: string): Promise<boolean>;
}
