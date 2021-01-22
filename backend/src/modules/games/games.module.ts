import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from 'nestjs-redis';

import cacheConfig from 'src/shared/configs/cache.config';

import { GamesController } from 'src/modules/games/games.controller';

import { User } from 'src/modules/users/entities/user.entity';
import { Game } from 'src/modules/games/entities/game.entity';
import { Player } from 'src/modules/games/entities/player.entity';

import { GamesGateway } from 'src/modules/games/games.gateway';

import { QuizzesModule } from 'src/modules/quizzes/quizzes.module';

import { GamesService } from 'src/modules/games/games.service';

@Module({
  imports: [
    RedisModule.register({ ...cacheConfig, db: 0, name: 'games' }),
    SequelizeModule.forFeature([Game, Player, User]),
    QuizzesModule,
  ],
  controllers: [GamesController],
  providers: [GamesGateway, GamesService],
})
export class GamesModule {}
