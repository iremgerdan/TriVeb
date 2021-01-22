import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import databaseConfig from 'src/shared/configs/database.config';

import { GamesModule } from 'src/modules/games/games.module';
import { QuizzesModule } from 'src/modules/quizzes/quizzes.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [SequelizeModule.forRoot(databaseConfig), GamesModule, UsersModule, QuizzesModule],
})
export class AppModule {}
