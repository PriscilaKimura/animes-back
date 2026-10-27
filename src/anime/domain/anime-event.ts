import { Anime } from './anime';

export const ANIME_EVENTS = {
  created: 'anime.created',
  updated: 'anime.updated',
  deleted: 'anime.deleted',
} as const;

export type AnimeEventName = (typeof ANIME_EVENTS)[keyof typeof ANIME_EVENTS];

export interface AnimeEvent {
  name: AnimeEventName;
  occurredAt: string;
  data: Anime | { id: string };
}

export const ANIME_NOTIFIER = Symbol('ANIME_NOTIFIER');

export interface AnimeNotifier {
  notify(event: AnimeEvent): Promise<void>;
}
