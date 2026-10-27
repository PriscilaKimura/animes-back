import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Anime, AnimeData } from '../domain/anime';
import { ANIME_EVENTS, ANIME_NOTIFIER, AnimeNotifier } from '../domain/anime-event';
import { COVER_STORAGE, CoverStorage } from '../domain/cover-storage';
import { ANIME_REPOSITORY, AnimeRepository } from '../domain/anime.repository';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_COVER_BYTES = 2 * 1024 * 1024;

export interface UploadedCover {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

@Injectable()
export class AnimeService {
  constructor(
    @Inject(ANIME_REPOSITORY)
    private readonly animes: AnimeRepository,
    @Inject(ANIME_NOTIFIER)
    private readonly notifier: AnimeNotifier,
    @Inject(COVER_STORAGE)
    private readonly covers: CoverStorage,
  ) {}

  findAll(): Promise<Anime[]> {
    return this.animes.findAll();
  }

  async findById(id: string): Promise<Anime> {
    this.assertUuid(id);
    const anime = await this.animes.findById(id);
    if (!anime) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
    return anime;
  }

  async create(dto: CreateAnimeDto): Promise<Anime> {
    const anime = await this.animes.create({
      title: dto.title,
      description: dto.description,
      completed: dto.completed,
      releaseDate: dto.releaseDate.slice(0, 10),
      type: dto.type,
      imageUrl: dto.imageUrl,
      ranking: dto.ranking,
    });
    await this.notifier.notify({
      name: ANIME_EVENTS.created,
      occurredAt: new Date().toISOString(),
      data: anime,
    });
    return anime;
  }

  async update(id: string, dto: UpdateAnimeDto): Promise<Anime> {
    this.assertUuid(id);
    const changes: Partial<AnimeData> = { ...dto };
    if (dto.releaseDate) {
      changes.releaseDate = dto.releaseDate.slice(0, 10);
    }
    const anime = await this.animes.update(id, changes);
    if (!anime) {
      throw new NotFoundException(
        `Anime com ID ${id} não foi encontrado para atualização.`,
      );
    }
    await this.notifier.notify({
      name: ANIME_EVENTS.updated,
      occurredAt: new Date().toISOString(),
      data: anime,
    });
    return anime;
  }

  async remove(id: string): Promise<{ message: string }> {
    this.assertUuid(id);
    const wasDeleted = await this.animes.remove(id);
    if (!wasDeleted) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
    await this.notifier.notify({
      name: ANIME_EVENTS.deleted,
      occurredAt: new Date().toISOString(),
      data: { id },
    });
    return { message: `Anime com ID ${id} foi deletado com sucesso.` };
  }

  async attachCover(id: string, file?: UploadedCover): Promise<Anime> {
    this.assertUuid(id);
    if (!file) {
      throw new BadRequestException('Envie a capa no campo file.');
    }
    if (!COVER_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('A capa precisa ser JPEG, PNG ou WebP.');
    }
    if (file.size > MAX_COVER_BYTES) {
      throw new BadRequestException('A capa pode ter no máximo 2MB.');
    }

    await this.findById(id);
    const imageUrl = await this.covers.upload({
      animeId: id,
      filename: file.originalname,
      contentType: file.mimetype,
      body: file.buffer,
    });
    return this.update(id, { imageUrl });
  }

  private assertUuid(id: string) {
    if (!UUID_PATTERN.test(id)) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
  }
}
