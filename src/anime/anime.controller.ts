// Este arquivo define as rotas da API e interage com o serviço
import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from 'src/anime/dto/createAnime.dto';
import { UpdateAnimeDto } from 'src/anime/dto/uptadeAnime.dto';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  // Busca todos os animes
  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  // Busca um anime por ID
  @Get(':id')
  async getById(@Param('id') id: string) {
    const anime = await this.animeService.findById(id);
    if (!anime) {
      throw new NotFoundException('Anime não encontrado');
    }
    return anime;
  }

  // Cria um novo anime
  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  // Atualiza um anime existente por ID
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(id, updateAnimeDto);
  }

  // Remove um anime por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }
}
