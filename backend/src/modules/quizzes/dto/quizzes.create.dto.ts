import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

import { QuizzesCreateQuestionDto } from 'src/modules/quizzes/dto/quizzes.create-question.dto';

export class QuizzesCreateDto {
  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 256)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  creatorId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  questions: QuizzesCreateQuestionDto[];
}
