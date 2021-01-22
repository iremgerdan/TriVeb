import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Game } from 'src/modules/games/entities/game.entity';
import { Question } from 'src/modules/quizzes/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Table
export class Quiz extends Model<Quiz> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  creatorId: number;

  @BelongsTo(() => User, 'creatorId')
  creator: User;

  @Column({ type: DataType.STRING(256), allowNull: false })
  name: string;

  @HasMany(() => Question, {
    onDelete: 'CASCADE',
  })
  questions: Question[];

  @HasMany(() => Game, {
    onDelete: 'CASCADE',
  })
  games: Game[];
}
