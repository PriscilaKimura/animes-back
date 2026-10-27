import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ANIME_TYPES, AnimeType } from '../../domain/anime';

export class CreateAnimeDto {
  @ApiProperty({ example: 'Cowboy Bebop' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Caçadores de recompensa no espaço.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({ example: '1998-04-03' })
  @IsDateString()
  releaseDate: string;

  @ApiProperty({ enum: ANIME_TYPES, example: 'série' })
  @IsIn(ANIME_TYPES)
  type: AnimeType;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 9, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  ranking?: number;
}
