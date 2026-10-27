import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ANIME_TYPES, AnimeType } from '../../domain/anime';

export class UpdateAnimeDto {
  @ApiPropertyOptional({ example: 'Cowboy Bebop' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ example: '1998-04-03' })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiPropertyOptional({ enum: ANIME_TYPES })
  @IsOptional()
  @IsIn(ANIME_TYPES)
  type?: AnimeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  ranking?: number;
}
