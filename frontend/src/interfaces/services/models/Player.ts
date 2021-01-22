import { Game } from './Game';

export interface Player {
  id: number;
  gameId: number;
  game: Game;
  playerName: string;
  totalPoints: number;
  numberOfCorrectAnswers: number;
  numberOfIncorrectAnswers: number;
  numberOfEmptyAnswers: number;
}
