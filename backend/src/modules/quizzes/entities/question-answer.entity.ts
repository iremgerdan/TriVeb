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

import { Question } from 'src/modules/quizzes/entities/question.entity';

@Table
export class QuestionAnswer extends Model<QuestionAnswer> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => Question)
  @Column({ type: DataType.INTEGER, allowNull: false })
  questionId: number;

  @BelongsTo(() => Question, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  })
  question: Question;

  @Column({ type: DataType.TEXT, allowNull: false })
  answer: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isCorrectAnswer: boolean;
}
