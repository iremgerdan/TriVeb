import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString, Length } from 'class-validator';

import { QuizzesCreateQuestionDto } from 'src/modules/quizzes/dto/quizzes.create-question.dto';

export class QuizzesUpdateDto {
  @IsOptional()
  @Transform((value: string) => value.trim())
  @IsString()
  @Length(1, 256)
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  questions?: QuizzesCreateQuestionDto[];
}
