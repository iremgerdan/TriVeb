import * as validator from 'class-validator';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { QuizzesCreateDto } from 'src/modules/quizzes/dto/quizzes.create.dto';
import { QuizzesLookupDto } from 'src/modules/quizzes/dto/quizzes.lookup.dto';
import { QuizzesLookupOptionsDto } from 'src/modules/quizzes/dto/quizzes.lookup-options.dto';
import { QuizzesUpdateDto } from 'src/modules/quizzes/dto/quizzes.update.dto';

import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

import { QuizzesService } from 'src/modules/quizzes/quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('/')
  async lookup(@Query() dto: QuizzesLookupDto): Promise<Quiz[]> {
    return this.quizzesService.lookup(dto);
  }

  @Get('/:id')
  async getOneById(
    @Query() options: QuizzesLookupOptionsDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Quiz> {
    return this.quizzesService.findOneById(id, options);
  }

  @Get('/:creatorId/:quizId')
  async getOneByCreatorIdAndQuizId(
    @Query() options: QuizzesLookupOptionsDto,
    @Param('creatorId', ParseIntPipe) creatorId: number,
    @Param('quizId', ParseIntPipe) quizId: number,
  ): Promise<Quiz> {
    return this.quizzesService.findOneByCreatorIdAndQuizId(creatorId, quizId, options);
  }

  @Get('/@me')
  @UseGuards(AuthGuard('user-auth'))
  async getQuizzesOfCurrentUser(@Query() dto: QuizzesLookupDto, @Req() req: any): Promise<Quiz[]> {
    if (validator.isDefined(dto.creatorIds)) {
      throw new UnauthorizedException();
    }
    dto.creatorIds = [req.user.id];

    return this.quizzesService.lookup(dto);
  }

  @Post('/')
  @UseGuards(AuthGuard('user-auth'))
  async create(@Body() dto: QuizzesCreateDto, @Req() req: any): Promise<Quiz> {
    if (validator.isDefined(dto.creatorId)) {
      throw new UnauthorizedException();
    }
    dto.creatorId = req.user.id;

    return this.quizzesService.create(dto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('user-auth'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: QuizzesUpdateDto,
    @Req() req: any,
  ): Promise<Quiz> {
    const creatorId = await this.quizzesService.findCreatorIdByQuizId(id);

    if (creatorId !== req.user.id) {
      throw new UnauthorizedException();
    }

    return this.quizzesService.update(id, dto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('user-auth'))
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<void> {
    const creatorId = await this.quizzesService.findCreatorIdByQuizId(id);

    if (creatorId !== req.user.id) {
      throw new UnauthorizedException();
    }

    return this.quizzesService.remove(id);
  }
}
