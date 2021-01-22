import { IsString, Length, MaxLength, MinLength } from 'class-validator';

export class GamesFinishGameDto {
  @IsString()
  @Length(6)
  pin: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  playerName: string;
}
