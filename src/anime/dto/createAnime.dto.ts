// Este arquivo define os dados esperados para criar um novo anime.
import { IsString, IsNotEmpty, IsBoolean, IsDateString } from 'class-validator';

export class CreateAnimeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @IsDateString()
  @IsNotEmpty()
  releaseDate: string;

  @IsString()
  type?: 'filme' | 'série'; // Adicionando o campo tipo (série ou filme)

  @IsString()
  @IsNotEmpty()
  imageUrl: string; // Novo campo para URL da imagem

}
