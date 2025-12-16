import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateRamaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;
}
