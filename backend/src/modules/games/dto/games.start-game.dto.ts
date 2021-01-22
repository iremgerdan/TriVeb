import { IsString, Length } from 'class-validator';

export class GamesStartGameDto {
  @IsString()
  @Length(6)
  pin: string;
}
