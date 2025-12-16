import { IsOptional, IsString, IsUrl, IsNumber } from 'class-validator';

export class AddExperienciaDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  empresa?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsNumber()
  startYear?: number;

  @IsOptional()
  @IsNumber()
  endYear?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
