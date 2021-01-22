import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class QuizzesCreateAnswerDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  questionId?: number;

  @Transform((value: string) => value.trim())
  @IsString()
  @MinLength(1)
  answer: string;

  @IsBoolean()
  isCorrectAnswer: boolean;
}
