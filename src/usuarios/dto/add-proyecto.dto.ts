import { IsOptional, IsString, IsArray } from 'class-validator';

export class AddProyectoDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  urls?: string[];
}
