import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ANIME_EVENTS, ANIME_NOTIFIER } from '../domain/anime-event';
import { COVER_STORAGE } from '../domain/cover-storage';
import { ANIME_REPOSITORY } from '../domain/anime.repository';
import { AnimeService } from './anime.service';

const anime = {
  id: '6f0b9d6e-3c2a-4f1b-9a55-2b7e1d4c8a10',
  title: 'Cowboy Bebop',
  description: 'Caçadores de recompensa',
  completed: false,
  releaseDate: '1998-04-03',
  type: 'série' as const,
  ranking: 9,
};

describe('AnimeService', () => {
  const repository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const notifier = { notify: jest.fn() };
  const covers = { upload: jest.fn() };
  let service: AnimeService;

  beforeEach(async () => {
    jest.clearAllMocks();
    notifier.notify.mockResolvedValue(undefined);
    const module = await Test.createTestingModule({
      providers: [
        AnimeService,
        { provide: ANIME_REPOSITORY, useValue: repository },
        { provide: ANIME_NOTIFIER, useValue: notifier },
        { provide: COVER_STORAGE, useValue: covers },
      ],
    }).compile();
    service = module.get(AnimeService);
  });

  it('cria o anime e publica anime.created', async () => {
    repository.create.mockResolvedValue(anime);

    const created = await service.create({
      title: anime.title,
      description: anime.description,
      completed: false,
      releaseDate: '1998-04-03T00:00:00.000Z',
      type: 'série',
      ranking: 9,
    });

    expect(created).toEqual(anime);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ releaseDate: '1998-04-03' }),
    );
    expect(notifier.notify).toHaveBeenCalledWith(
      expect.objectContaining({ name: ANIME_EVENTS.created, data: anime }),
    );
  });

  it('não consulta o banco quando o id não é uuid', async () => {
    await expect(service.findById('1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('retorna 404 quando o anime não existe', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(anime.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('publica anime.deleted com o id removido', async () => {
    repository.remove.mockResolvedValue(true);

    await expect(service.remove(anime.id)).resolves.toEqual({
      message: `Anime com ID ${anime.id} foi deletado com sucesso.`,
    });

    expect(notifier.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        name: ANIME_EVENTS.deleted,
        data: { id: anime.id },
      }),
    );
  });

  it('recusa capa que não é imagem', async () => {
    await expect(
      service.attachCover(anime.id, {
        buffer: Buffer.from('abc'),
        mimetype: 'text/plain',
        originalname: 'notas.txt',
        size: 3,
      }),
    ).rejects.toThrow('JPEG');
    expect(covers.upload).not.toHaveBeenCalled();
  });
});
