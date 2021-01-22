import * as validator from 'class-validator';

import _ from 'lodash';

import { UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { GamesCreateGameDto } from 'src/modules/games/dto/games.create-game.dto';
import { GamesJoinGameDto } from 'src/modules/games/dto/games.join-game.dto';
import { GamesAnswerQuestionDto } from 'src/modules/games/dto/games.answer-question.dto';
import { GamesFinishGameDto } from './dto/games.finish-game.dto';

import { GamesService } from 'src/modules/games/games.service';
import { QuizzesService } from 'src/modules/quizzes/quizzes.service';

@WebSocketGateway()
export class GamesGateway {
  constructor(
    private readonly gamesService: GamesService,
    private readonly quizzesService: QuizzesService,
  ) {}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('create-game')
  async createGame(client: Socket, payload: GamesCreateGameDto): Promise<void> {
    const creatorId = await this.quizzesService.findCreatorIdByQuizId(payload.quizId);

    // TODO: Check if authorized

    const pin = await this.gamesService.createGame(payload.quizId);

    client.join(pin);

    client.emit('game-created', { pin });
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('join-game')
  async joinGame(client: Socket, payload: GamesJoinGameDto): Promise<void> {
    const player = await this.gamesService.joinGame(payload.pin, payload.playerName);

    client.join(payload.pin);

    client.to(payload.pin).emit('player-joined', player);
    client.emit('player-joined', player);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('start-game')
  async startGame(client: Socket, payload: GamesJoinGameDto): Promise<void> {
    const quiz = await this.gamesService.startGame(payload.pin);

    client.to(payload.pin).emit('game-started', quiz);
    client.emit('game-started', quiz);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('answer-question')
  async answerQuestion(client: Socket, payload: GamesAnswerQuestionDto): Promise<void> {
    const result = await this.gamesService.answerQuestion(payload);

    client.to(payload.pin).emit('question-answered', result);
    client.emit('answer-result', result);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('finish-game')
  async finishGame(client: Socket, payload: GamesFinishGameDto): Promise<void> {
    const game = await this.gamesService.finishGame(payload.pin);

    client.to(payload.pin).emit('game-finished', game);
    client.emit('game-finished', game);
  }
}
