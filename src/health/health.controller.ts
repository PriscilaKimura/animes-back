import { Controller, Get } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly orm: MikroORM) {}

  @Get()
  @ApiOperation({ summary: 'Verifica a API e o PostgreSQL' })
  async check() {
    await this.orm.em.getConnection().execute('select 1');
    return { status: 'ok' };
  }
}
