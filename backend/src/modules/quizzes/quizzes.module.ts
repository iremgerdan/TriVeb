import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import securityConfig from 'src/shared/configs/security.config';

import { UserAuthStrategy } from 'src/shared/auths/user/user-auth.strategy';

import { QuizzesController } from 'src/modules/quizzes/quizzes.controller';

import { User } from 'src/modules/users/entities/user.entity';
import { Question } from 'src/modules/quizzes/entities/question.entity';
import { QuestionAnswer } from 'src/modules/quizzes/entities/question-answer.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

import { QuizzesService } from 'src/modules/quizzes/quizzes.service';

@Module({
  imports: [
    JwtModule.register({ secret: securityConfig.jwt.secret }),
    PassportModule.register({}),
    SequelizeModule.forFeature([User, Question, QuestionAnswer, Quiz]),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService, UserAuthStrategy],
  exports: [QuizzesService],
})
export class QuizzesModule {}
