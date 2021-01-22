import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class GamesAnswerQuestionDto {
  @IsString()
  @Length(6)
  pin: string;

  @IsUUID(4)
  playerId: string;

  @IsInt()
  @Min(1)
  questionId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  answerId: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  answerTime: number;
}
