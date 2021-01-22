import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Game } from 'src/modules/games/entities/game.entity';

@Table
export class Player extends Model<Player> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Game)
  @Column({ type: DataType.INTEGER, allowNull: false })
  gameId: number;

  @BelongsTo(() => Game, 'gameId')
  game: Game;

  @Column({ type: DataType.STRING(100), allowNull: false })
  playerName: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  totalPoints: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  numberOfCorrectAnswers: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  numberOfIncorrectAnswers: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  numberOfEmptyAnswers: number;
}
