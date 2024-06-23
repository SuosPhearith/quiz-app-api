// assign-quiz.dto.ts
import { IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

class UserDto {
  @IsInt()
  id: number;
}

export class AssignQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  users: UserDto[];
}
