import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ANIME_CATALOG, AnimeCatalog, CatalogAnime } from '../domain/anime-catalog';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(ANIME_CATALOG)
    private readonly catalog: AnimeCatalog,
  ) {}

  search(query?: string): Promise<CatalogAnime[]> {
    const term = query?.trim() ?? '';
    if (term.length < 2) {
      throw new BadRequestException('Digite pelo menos 2 caracteres para buscar.');
    }
    return this.catalog.search(term);
  }
}
