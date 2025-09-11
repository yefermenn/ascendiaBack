import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  @MinLength(8)
  contraseña: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fotoPerfil?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  biografia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rol?: string; // 'usuario', 'admin', etc.
}
