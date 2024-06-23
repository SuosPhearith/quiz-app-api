import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/auth/enum/gender.enum';

export class UpdateEmployeeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly avatar?: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  readonly gender: Gender;
}
