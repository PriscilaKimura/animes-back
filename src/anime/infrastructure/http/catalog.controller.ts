import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CatalogService } from '../../application/catalog.service';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('anime')
  @ApiOperation({
    summary: 'Busca animes no catálogo público (AniList)',
  })
  @ApiQuery({ name: 'q', required: true, example: 'cowboy bebop' })
  search(@Query('q') query: string) {
    return this.catalog.search(query);
  }
}
