import * as validator from 'class-validator';

import _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseError, DatabaseErrorType } from 'src/shared/errors/database.error';
import { GameError, GameErrorType } from 'src/shared/errors/game.error';

import { GamesAnswerQuestionDto } from 'src/modules/games/dto/games.answer-question.dto';

import { Game as IGame } from 'src/modules/games/interfaces/game.interface';
import { Player as IPlayer } from 'src/modules/games/interfaces/player.interface';

import { Game } from 'src/modules/games/entities/game.entity';
import { Player } from 'src/modules/games/entities/player.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

import { QuizzesService } from 'src/modules/quizzes/quizzes.service';

@Injectable()
export class GamesService {
  private readonly client: Redis;
  private readonly clientName = 'games';

  constructor(
    @InjectModel(Game) private readonly gameModel: typeof Game,
    @InjectModel(Player) private readonly playerModel: typeof Player,
    private readonly redisService: RedisService,
    private readonly quizzesService: QuizzesService,
    private readonly sequelize: Sequelize,
  ) {
    this.client = this.redisService.getClient(this.clientName);
  }

  async findGameByPin(pin: string): Promise<IGame> {
    const game: string = await this.client.get(pin);

    if (!validator.isDefined(game)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.clientName, { pin });
    }

    return JSON.parse(game);
  }

  async setGameByPin(pin: string, game: IGame): Promise<void> {
    await this.client.set(pin, JSON.stringify(game));
  }

  async createGame(quizId: number): Promise<string> {
    const pin = _.random(0, 999999).toString().padEnd(6, '0');
    const quiz = await this.quizzesService.findOneById(quizId);

    const game = { quizId, players: [], numberOfQuestions: quiz.questions.length };

    await this.setGameByPin(pin, game);

    return pin;
  }

  async joinGame(pin: string, playerName: string): Promise<IPlayer> {
    const game = await this.findGameByPin(pin);

    const player: IPlayer = {
      id: uuidv4(),
      playerName,
      points: 0,
      numberOfCorrectAnswers: 0,
      numberOfIncorrectAnswers: 0,
      numberOfEmptyAnswers: 0,
    };

    game.players.push(player);

    await this.setGameByPin(pin, game);

    return player;
  }

  async startGame(pin: string): Promise<Quiz> {
    const game = await this.findGameByPin(pin);

    if (validator.isDefined(game.startedAt)) {
      throw new GameError(GameErrorType.STARTED_GAME, pin);
    }

    game.startedAt = new Date();

    const quiz = await this.quizzesService.findOneById(game.quizId);

    await this.setGameByPin(pin, game);

    return quiz;
  }

  async finishGame(pin: string): Promise<Game> {
    const game = await this.findGameByPin(pin);

    let entity: Game;

    game.finishedAt = new Date();

    await this.sequelize.transaction(async (transaction) => {
      entity = this.gameModel.build();

      entity.quizId = game.quizId;
      entity.startedAt = game.startedAt;
      entity.finishedAt = game.finishedAt;

      await entity.save({ transaction });

      const playerEntities = game.players.map((player) => {
        const numberOfEmptyAnswers =
          game.numberOfQuestions -
          (player.numberOfCorrectAnswers + player.numberOfIncorrectAnswers);

        return {
          gameId: entity.id,
          playerName: player.playerName,
          totalPoints: player.points,
          numberOfCorrectAnswers: player.numberOfCorrectAnswers,
          numberOfIncorrectAnswers: player.numberOfIncorrectAnswers,
          numberOfEmptyAnswers,
        };
      });

      const players = await this.playerModel.bulkCreate(playerEntities, { transaction });

      entity.setDataValue('players', players);
    });

    await this.client.del(pin);

    return entity;
  }

  async answerQuestion(
    dto: GamesAnswerQuestionDto,
  ): Promise<{
    isCorrect: boolean;
    playerPoint: number;
  }> {
    const game = await this.findGameByPin(dto.pin);

    let gainedPoint = 0;
    let increaseInCorrectAnswers = 0;
    let increaseInIncorrectAnswers = 0;

    const correctAnswer = await this.quizzesService.findCorrectAnswerOfQuestion(dto.questionId);

    const isPlayerAnswerCorrect = correctAnswer.id === dto.answerId;

    increaseInCorrectAnswers = isPlayerAnswerCorrect ? 1 : 0;
    increaseInIncorrectAnswers = !isPlayerAnswerCorrect ? 1 : 0;

    gainedPoint = isPlayerAnswerCorrect ? Math.round((1 / dto.answerTime) * 100) : 0;

    let updatedPlayerPoint = 0;

    game.players = game.players.map((player) => {
      if (player.id === dto.playerId) {
        player.points += gainedPoint;
        player.numberOfCorrectAnswers += increaseInCorrectAnswers;
        player.numberOfIncorrectAnswers += increaseInIncorrectAnswers;

        updatedPlayerPoint = player.points;
      }

      return player;
    });

    await this.setGameByPin(dto.pin, game);

    return {
      isCorrect: increaseInCorrectAnswers === 1,
      playerPoint: updatedPlayerPoint,
    };
  }
}
