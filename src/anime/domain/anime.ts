export const ANIME_TYPES = ['filme', 'série'] as const;

export type AnimeType = (typeof ANIME_TYPES)[number];

export interface Anime {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  releaseDate: string;
  type?: AnimeType;
  imageUrl?: string;
  ranking?: number;
}

export interface AnimeData {
  title: string;
  description: string;
  completed: boolean;
  releaseDate: string;
  type?: AnimeType;
  imageUrl?: string;
  ranking?: number;
}
