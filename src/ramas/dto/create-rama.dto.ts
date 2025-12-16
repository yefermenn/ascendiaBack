import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRamaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
