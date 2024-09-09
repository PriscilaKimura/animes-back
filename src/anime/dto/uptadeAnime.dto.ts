 // Este arquivo define os dados esperados para atualizar um anime existente
 import { IsString, IsBoolean, IsDateString, IsOptional,  IsNumber } from 'class-validator';

 export class UpdateAnimeDto {
   @IsString()
   @IsOptional()
   title?: string;
 
   @IsString()
   @IsOptional()
   description?: string;
 
   @IsBoolean()
   @IsOptional()
   completed?: boolean;
 
   @IsDateString()
   @IsOptional()
   releaseDate?: string;

   @IsString()
  @IsOptional()
  type?: 'filme' | 'série'; 

  @IsString()
  @IsOptional()
  imageUrl?: string; 

  @IsNumber()
  @IsOptional()
  ranking?: number;  
 
}
 


