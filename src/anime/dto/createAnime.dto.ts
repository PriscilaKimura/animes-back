// Este arquivo define os dados esperados para criar um novo anime.
import { IsString, IsNotEmpty, IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';

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
  type?: 'filme' | 'série'; 
  
  @IsOptional() 
  @IsString()
  imageUrl?: string; 

  @IsOptional()  
  @IsNumber()
  ranking?: number;    

}
