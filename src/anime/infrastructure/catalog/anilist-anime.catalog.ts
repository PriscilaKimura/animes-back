import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { AnimeType } from '../../domain/anime';
import { AnimeCatalog, CatalogAnime } from '../../domain/anime-catalog';

interface AnilistMedia {
  id: number;
  title?: { romaji?: string | null; english?: string | null };
  description?: string | null;
  format?: string | null;
  coverImage?: { large?: string | null };
  startDate?: { year?: number | null; month?: number | null; day?: number | null };
  averageScore?: number | null;
}

interface AnilistSearchResponse {
  data?: {
    Page?: {
      media?: AnilistMedia[];
    };
  };
  errors?: Array<{ message?: string }>;
}

const SEARCH_QUERY = `
  query ($search: String) {
    Page(page: 1, perPage: 8) {
      media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
        id
        title { romaji english }
        description
        format
        coverImage { large }
        startDate { year month day }
        averageScore
      }
    }
  }
`;

@Injectable()
export class AnilistAnimeCatalog implements AnimeCatalog {
  private readonly logger = new Logger(AnilistAnimeCatalog.name);
  private readonly endpoint = 'https://graphql.anilist.co';

  async search(query: string): Promise<CatalogAnime[]> {
    const term = query.trim();
    if (term.length < 2) {
      return [];
    }

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: SEARCH_QUERY,
          variables: { search: term },
        }),
      });
    } catch (error) {
      this.logger.error(
        'Falha de rede ao consultar a AniList',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException(
        'O catálogo de animes está indisponível no momento.',
      );
    }

    if (response.status === 429) {
      throw new ServiceUnavailableException(
        'Muitas buscas seguidas. Espere alguns segundos e tente de novo.',
      );
    }

    if (!response.ok) {
      this.logger.error(`AniList respondeu ${response.status}`);
      throw new ServiceUnavailableException(
        'O catálogo de animes está indisponível no momento.',
      );
    }

    const payload = (await response.json()) as AnilistSearchResponse;
    if (payload.errors?.length) {
      this.logger.error(payload.errors.map((item) => item.message).join('; '));
      throw new ServiceUnavailableException(
        'O catálogo de animes está indisponível no momento.',
      );
    }

    return (payload.data?.Page?.media ?? []).map(toCatalogAnime);
  }
}

export function toCatalogAnime(item: AnilistMedia): CatalogAnime {
  return {
    externalId: String(item.id),
    title:
      item.title?.english?.trim() ||
      item.title?.romaji?.trim() ||
      'Sem título',
    description: cleanSynopsis(item.description),
    releaseDate: asDateOnly(item.startDate),
    type: mapType(item.format),
    imageUrl: item.coverImage?.large ?? undefined,
    ranking: asRanking(item.averageScore),
  };
}

function cleanSynopsis(synopsis?: string | null): string {
  if (!synopsis) {
    return 'Sinopse não disponível.';
  }
  return synopsis
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function mapType(format?: string | null): AnimeType {
  return format === 'MOVIE' ? 'filme' : 'série';
}

function asDateOnly(date?: {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}): string | undefined {
  if (!date?.year || !date.month || !date.day) {
    return undefined;
  }
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

function asRanking(score?: number | null): number | undefined {
  if (typeof score !== 'number' || Number.isNaN(score)) {
    return undefined;
  }
  return Math.min(10, Math.max(0, Math.round(score / 10)));
}
