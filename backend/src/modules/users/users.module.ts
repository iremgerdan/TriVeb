import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';

import securityConfig from 'src/shared/configs/security.config';

import { UserAuthStrategy } from 'src/shared/auths/user/user-auth.strategy';

import { UsersController } from 'src/modules/users/users.controller';

import { User } from 'src/modules/users/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';

@Module({
  imports: [
    JwtModule.register({ secret: securityConfig.jwt.secret }),
    PassportModule.register({}),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserAuthStrategy],
})
export class UsersModule {}
