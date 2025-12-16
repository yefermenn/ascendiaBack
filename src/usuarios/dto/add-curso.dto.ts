import { IsOptional, IsString, IsUrl, IsNumber } from 'class-validator';

export class AddCursoDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  institucion?: string;

  @IsOptional()
  @IsNumber()
  anio?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsNumber()
  ramaId?: number;
}
