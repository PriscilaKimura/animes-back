import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnimeService, UploadedCover } from '../../application/anime.service';
import { CreateAnimeDto } from '../../application/dto/create-anime.dto';
import { UpdateAnimeDto } from '../../application/dto/update-anime.dto';

@ApiTags('animes')
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  @ApiOperation({ summary: 'Lista os animes' })
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um anime pelo id' })
  findOne(@Param('id') id: string) {
    return this.animeService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um anime' })
  create(@Body() dto: CreateAnimeDto) {
    return this.animeService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um anime' })
  update(@Param('id') id: string, @Body() dto: UpdateAnimeDto) {
    return this.animeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um anime' })
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }

  @Post(':id/cover')
  @ApiOperation({ summary: 'Envia a capa do anime para o S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }),
  )
  attachCover(@Param('id') id: string, @UploadedFile() file?: UploadedCover) {
    return this.animeService.attachCover(id, file);
  }
}
