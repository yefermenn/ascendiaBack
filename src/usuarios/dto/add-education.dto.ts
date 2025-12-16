import { IsOptional, IsString, IsUrl } from 'class-validator';

export class AddEducationDto {
  @IsOptional()
  @IsString()
  externalId?: string;

  @IsOptional()
  @IsString()
  institucion?: string;

  @IsOptional()
  @IsString()
  tituloObtenido?: string;

  @IsOptional()
  @IsString()
  nivel?: string;

  @IsOptional()
  @IsString()
  anio?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
