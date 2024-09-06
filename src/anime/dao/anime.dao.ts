// Este arquivo simula o banco de dados, armazenando os dados em memória
import { Injectable, NotFoundException } from '@nestjs/common';
import { Anime } from '../interfaces/anime.interface';
import { CreateAnimeDto } from 'src/anime/dto/createAnime.dto';
import { UpdateAnimeDto } from 'src/anime/dto/uptadeAnime.dto';

@Injectable()
export class AnimeDao {
  private animes: Anime[] = [];
  private idCounter = 1;

  // Retorna todos os animes
  findAll(): Anime[] {
    return this.animes;
  }

  // Busca um anime pelo ID
  findById(id: string): Anime {
    const anime = this.animes.find(anime => anime.id === id);
    if (!anime) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
    return anime;
  }

  // Cria um novo anime
  create(createAnimeDto: CreateAnimeDto): Anime {
    const newAnime: Anime = {
      id: (this.idCounter++).toString(),
      ...createAnimeDto,
    };
    this.animes.push(newAnime);
    return newAnime;
  }

  // Atualiza um anime existente
  update(id: string, updateAnimeDto: UpdateAnimeDto): Anime {
    const index = this.animes.findIndex(anime => anime.id === id);
    if (index === -1) {
      throw new NotFoundException(`Anime com ID ${id} não foi encontrado.`);
    }
    this.animes[index] = { ...this.animes[index], ...updateAnimeDto };
    return this.animes[index];
  }

  // Remove um anime pelo ID
  remove(id: string): boolean {
    const initialLength = this.animes.length;
    this.animes = this.animes.filter(anime => anime.id !== id);
    return this.animes.length < initialLength;
  }
}

