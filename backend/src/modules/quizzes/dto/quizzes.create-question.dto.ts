import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

import { QuizzesCreateAnswerDto } from 'src/modules/quizzes/dto/quizzes.create-answer.dto';

export class QuizzesCreateQuestionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quizId?: number;

  @Transform((value: string) => value.trim())
  @IsString()
  @MinLength(1)
  question: string;

  @IsInt()
  @Min(5)
  durationInSeconds: number;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  answers: QuizzesCreateAnswerDto[];
}
