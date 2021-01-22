import { IsInt, Min } from 'class-validator';

export class GamesCreateGameDto {
  @IsInt()
  @Min(1)
  quizId: number;
}
