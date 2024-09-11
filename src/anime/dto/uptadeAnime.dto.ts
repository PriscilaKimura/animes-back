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
   type?: 'filme' | 'série'; 
   
   @IsOptional() 
   @IsString()
   imageUrl?: string; 
 
   @IsOptional()  
   @IsNumber()
   ranking?: number;    
 
}
 


