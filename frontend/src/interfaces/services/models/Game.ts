import { Player } from './Player';
import { Quiz } from './Quiz';

export interface Game {
  id: number;
  quizId: number;
  quiz: Quiz;
  startedAt: Date;
  finishedAt: Date;
  players: Player[];
}
