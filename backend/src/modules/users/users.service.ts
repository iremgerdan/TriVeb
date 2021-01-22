import * as argon2 from 'argon2';
import * as validator from 'class-validator';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';

import queryHelper from 'src/shared/helpers/query.helper';

import { UserAuthPayload } from 'src/shared/auths/user/user-auth.payload';
import { DatabaseError, DatabaseErrorType } from 'src/shared/errors/database.error';
import { UserError, UserErrorType } from 'src/shared/errors/user.error';

import { UsersCreateDto } from 'src/modules/users/dto/users.create.dto';
import { UsersLoginDto } from 'src/modules/users/dto/users.login.dto';
import { UsersLookupDto } from 'src/modules/users/dto/users.lookup.dto';
import { UsersUpdateEmailDto } from 'src/modules/users/dto/users.update-email.dto';
import { UsersUpdatePasswordDto } from 'src/modules/users/dto/users.update-password.dto';
import { UsersUpdateProfileDto } from 'src/modules/users/dto/users.update-profile.dto';

import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UsersService {
  readonly orderableAttributes = ['id', 'fullname', 'createdAt', 'updatedAt'];
  readonly loadableAttributes = [...this.orderableAttributes];
  readonly defaultOrder = 'createdAt-';

  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
  ) {}

  async lookup(dto: UsersLookupDto, transaction?: Transaction): Promise<User[]> {
    const query: any = {};

    {
      const where: any = {};

      if (validator.isDefined(dto.ids)) {
        where.id = dto.ids;
      }

      if (validator.isDefined(dto.fullnames)) {
        where.fullname = {
          [Op.iLike]: {
            [Op.any]: dto.fullnames.map((item) => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.creationTimeSlice)) {
        where.createdAt = queryHelper.generateRangeQuery(dto.creationTimeSlice);
      }

      if (validator.isDefined(dto.updationTimeSlice)) {
        where.updatedAt = queryHelper.generateRangeQuery(dto.updationTimeSlice);
      }

      if (validator.isDefined(dto.search)) {
        where[Op.or] = [
          {
            fullname: {
              [Op.iLike]: {
                [Op.any]: dto.search.map((item) => `%${item}%`),
              },
            },
          },
        ];
      }

      query.where = where;
    }

    if (!validator.isDefined(dto.order)) {
      dto.order = this.defaultOrder;
    }
    query.order = queryHelper.transformOrder(dto.order, this.orderableAttributes);

    if (!validator.isDefined(dto.attributes)) {
      dto.attributes = this.loadableAttributes.join(',');
    }
    query.attributes = queryHelper.transformLoadAttributes(dto.attributes, this.loadableAttributes);

    if (validator.isDefined(dto.page)) {
      const { offset, limit } = queryHelper.transformPage(dto.page);
      query.offset = offset;
      query.limit = limit;
    }

    query.transaction = transaction;

    return this.userModel.findAll(query);
  }

  async findOneById(id: number, transaction?: Transaction): Promise<User> {
    const entity = await this.userModel.findByPk(id, { transaction });

    if (!validator.isDefined(entity)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.userModel.tableName, { id });
    }

    return entity;
  }

  async create(
    dto: UsersCreateDto,
  ): Promise<{
    user: User;
    token: string;
  }> {
    if (dto.password !== dto.passwordConfirmation) {
      throw new UserError(UserErrorType.MISMATCHED_PASSWORDS);
    }

    const entity = this.userModel.build();

    entity.email = dto.email;
    entity.password = await argon2.hash(dto.password);
    entity.fullname = dto.fullname;

    try {
      await this.sequelize.transaction(async (transaction) => {
        await entity.save({ transaction });
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseError(DatabaseErrorType.USED_EMAIL, dto.email);
      }
      throw error;
    }

    entity.password = undefined;

    const payload: UserAuthPayload = { id: entity.id };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: entity,
      token,
    };
  }

  async updateProfile(id: number, dto: UsersUpdateProfileDto): Promise<User> {
    const updates: any = {};

    if (validator.isDefined(dto.fullname)) {
      updates.fullname = dto.fullname;
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    const result = await this.userModel.update(updates, {
      where: { id },
      returning: true,
    });

    if (result[0] === 0) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.userModel.tableName, { id });
    }

    const entity = result[1][0];

    entity.password = undefined;

    return entity;
  }

  async updateEmail(id: number, dto: UsersUpdateEmailDto): Promise<User> {
    try {
      const result = await this.userModel.update(
        { email: dto.email },
        {
          where: { id },
          returning: true,
        },
      );

      if (result[0] === 0) {
        throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.userModel.tableName, { id });
      }

      const entity = result[1][0];

      entity.password = undefined;

      return entity;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new DatabaseError(DatabaseErrorType.USED_EMAIL, dto.email);
      }
      throw error;
    }
  }

  async updatePassword(id: number, dto: UsersUpdatePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.newPasswordConfirmation) {
      throw new UserError(UserErrorType.MISMATCHED_PASSWORDS);
    }

    const entity = await this.userModel.findByPk(id, {
      attributes: ['id', 'password'],
    });

    if (!validator.isDefined(entity)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.userModel.tableName, { id });
    }

    const isCorrectPassword = await argon2.verify(entity.password, dto.currentPassword);

    if (!isCorrectPassword) {
      throw new UserError(UserErrorType.WRONG_CURRENT_PASSWORD);
    }

    entity.password = await argon2.hash(dto.newPassword);

    await entity.save();
  }

  async remove(id: number): Promise<void> {
    const result = await this.userModel.destroy({
      where: { id },
    });

    if (result !== 0) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.userModel.tableName, { id });
    }
  }

  async login(
    dto: UsersLoginDto,
  ): Promise<{
    user: User;
    token: string;
  }> {
    const entity = await this.userModel.findOne({
      where: { email: dto.email },
      attributes: {
        include: ['password']
      },
    });

    const isCorrectPassword = await argon2.verify(entity.password, dto.password);

    if (!validator.isDefined(entity) || !isCorrectPassword) {
      throw new UserError(UserErrorType.WRONG_CREDENTIALS);
    }

    const payload: UserAuthPayload = { id: entity.id };

    entity.password = undefined;

    const token = await this.jwtService.signAsync(payload);

    return {
      user: entity,
      token,
    };
  }
}
