// create-quiz.dto.ts
import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Type as QuestionType } from '@prisma/client';

class CreateOptionDto {
  @IsString()
  letter: string;

  @IsString()
  name: string;
}

class CreateAnswerDto {
  @IsString()
  letter: string;
}

class CreateQuestionDto {
  @IsString()
  name: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsInt()
  score: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answer: CreateAnswerDto[];
}

export class CreateQuizDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
