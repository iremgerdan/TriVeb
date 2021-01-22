import { IsString, Length, MaxLength, MinLength } from 'class-validator';

export class GamesJoinGameDto {
  @IsString()
  @Length(6)
  pin: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  playerName: string;
}
