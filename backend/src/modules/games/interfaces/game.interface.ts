import { Player } from 'src/modules/games/interfaces/player.interface';

export interface Game {
  quizId: number;
  numberOfQuestions: number;
  players: Player[];
  startedAt?: Date;
  finishedAt?: Date;
}
