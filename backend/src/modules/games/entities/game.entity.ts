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

import { Player } from 'src/modules/games/entities/player.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

@Table
export class Game extends Model<Game> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.INTEGER, allowNull: false })
  quizId: number;

  @BelongsTo(() => Quiz, 'quizId')
  quiz: Quiz;

  @Column({ type: DataType.DATE, allowNull: false })
  startedAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  finishedAt: Date;

  @HasMany(() => Player, {
    onDelete: 'CASCADE',
  })
  players: Player[];
}
