import * as validator from 'class-validator';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { Strategy, ExtractJwt } from 'passport-jwt';

import securityConfig from 'src/shared/configs/security.config';

import { UserAuthPayload } from 'src/shared/auths/user/user-auth.payload';

import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserAuthStrategy extends PassportStrategy(Strategy, 'user-auth') {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: securityConfig.jwt.secret,
    });
  }

  async validate(payload: UserAuthPayload): Promise<User> {
    const user = await this.userModel.findByPk(payload.id);

    if (!validator.isDefined(user)) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
