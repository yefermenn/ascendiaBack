import { IsEmail, IsString, IsOptional, MinLength, MaxLength, IsBoolean, IsArray, ValidateNested, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsBoolean()
  acceptTerms?: boolean;

  @IsOptional()
  @IsNumber()
  xp_total?: number;

  @IsOptional()
  @IsNumber()
  nivel_actual?: number;
}

export class ProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class ProfessionalFieldDto {
  @IsString()
  category: string;

  @IsString()
  specialty: string;
}

export class AvatarDto {
  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  shirtColor?: string;
}

export class EducationItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export class WorkItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  position: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  startYear?: number;

  @IsOptional()
  @IsInt()
  endYear?: number | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export class CourseItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export class ProjectItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  url?: string[];
}

export class ExperienceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  education: EducationItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkItemDto)
  work: WorkItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseItemDto)
  courses: CourseItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projects: ProjectItemDto[];
}

export class CreateUsuarioDto {
  @ValidateNested()
  @Type(() => AccountDto)
  account: AccountDto;

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @ValidateNested()
  @Type(() => ProfessionalFieldDto)
  professionalField: ProfessionalFieldDto;

  @ValidateNested()
  @Type(() => AvatarDto)
  avatar: AvatarDto;

  @ValidateNested()
  @Type(() => ExperienceDto)
  experience: ExperienceDto;
}
