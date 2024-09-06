// Este arquivo contém a lógica de negócios e interage com o DAO
import { Injectable, NotFoundException } from '@nestjs/common';
import { AnimeDao } from './dao/anime.dao';
import { CreateAnimeDto } from 'src/anime/dto/createAnime.dto';
import { UpdateAnimeDto } from 'src/anime/dto/uptadeAnime.dto';
import { Anime } from './interfaces/anime.interface';

@Injectable()
export class AnimeService {
  constructor(private readonly animeDao: AnimeDao) {}

  // Busca todos os animes
  findAll(): Anime[] {
    return this.animeDao.findAll();
  }

  // Busca um anime pelo ID
  findById(id: string): Anime {
    const anime = this.animeDao.findById(id);
    if (!anime) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
    return anime;
  }

  // Cria um novo anime
  create(createAnimeDto: CreateAnimeDto): Anime {
    return this.animeDao.create(createAnimeDto);
  }

  // Atualiza um anime existente
  update(id: string, updateAnimeDto: UpdateAnimeDto): Anime {
    const updatedAnime = this.animeDao.update(id, updateAnimeDto);
    if (!updatedAnime) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado para atualização.`);
    }
    return updatedAnime;
  }

  // Remove um anime pelo ID
  remove(id: string): { message: string } {
    const wasDeleted = this.animeDao.remove(id);
    if (wasDeleted) {
      return { message: `Anime com ID ${id} foi deletado com sucesso.` };
    } else {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
  }
}
