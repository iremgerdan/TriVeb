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

import { QuestionAnswer } from 'src/modules/quizzes/entities/question-answer.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

@Table
export class Question extends Model<Question> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.INTEGER, allowNull: false })
  quizId: number;

  @BelongsTo(() => Quiz, {
    foreignKey: 'quizId',
    onDelete: 'CASCADE',
  })
  quiz: Quiz;

  @Column({ type: DataType.TEXT, allowNull: false })
  question: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  durationInSeconds: number;

  @HasMany(() => QuestionAnswer, {
    onDelete: 'CASCADE',
  })
  answers: QuestionAnswer[];
}
