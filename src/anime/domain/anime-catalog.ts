import { AnimeType } from './anime';

export interface CatalogAnime {
  externalId: string;
  title: string;
  description: string;
  releaseDate?: string;
  type: AnimeType;
  imageUrl?: string;
  ranking?: number;
}

export const ANIME_CATALOG = Symbol('ANIME_CATALOG');

export interface AnimeCatalog {
  search(query: string): Promise<CatalogAnime[]>;
}
