// create-quiz.dto.ts

import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsString()
  @IsNotEmpty()
  letter: string;
}

class AnswerDto {
  @IsNotEmpty()
  questionId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  option: OptionDto[];
}

export class CreateQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
