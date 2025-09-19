import { IsEmail, IsInt, Min, Max } from 'class-validator';

export class AddExperienceDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(500)
  amount: number;
}
