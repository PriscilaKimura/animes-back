import { toCatalogAnime } from './anilist-anime.catalog';

describe('toCatalogAnime', () => {
  it('mapeia filme, capa e nota da AniList', () => {
    const result = toCatalogAnime({
      id: 164,
      title: { romaji: 'Mononoke Hime', english: 'Princess Mononoke' },
      description: 'Floresta e deuses.<br><br>Outro parágrafo.',
      format: 'MOVIE',
      averageScore: 86,
      startDate: { year: 1997, month: 7, day: 12 },
      coverImage: {
        large: 'https://cdn.example/large.jpg',
      },
    });

    expect(result).toEqual({
      externalId: '164',
      title: 'Princess Mononoke',
      description: 'Floresta e deuses.\n\nOutro parágrafo.',
      releaseDate: '1997-07-12',
      type: 'filme',
      imageUrl: 'https://cdn.example/large.jpg',
      ranking: 9,
    });
  });

  it('trata TV como série', () => {
    const result = toCatalogAnime({
      id: 1,
      title: { romaji: 'Cowboy Bebop', english: null },
      format: 'TV',
      description: null,
      averageScore: null,
      startDate: { year: null, month: null, day: null },
    });

    expect(result.type).toBe('série');
    expect(result.title).toBe('Cowboy Bebop');
    expect(result.description).toBe('Sinopse não disponível.');
    expect(result.ranking).toBeUndefined();
  });
});
