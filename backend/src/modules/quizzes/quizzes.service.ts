import * as transformer from 'class-transformer';
import * as validator from 'class-validator';

import _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize, Transaction } from 'sequelize';

import queryHelper from 'src/shared/helpers/query.helper';

import { DatabaseError, DatabaseErrorType } from 'src/shared/errors/database.error';
import { ValidationError, ValidationErrorType } from 'src/shared/errors/validation.error';

import { QuizzesCreateAnswerDto } from 'src/modules/quizzes/dto/quizzes.create-answer.dto';
import { QuizzesCreateDto } from 'src/modules/quizzes/dto/quizzes.create.dto';
import { QuizzesCreateQuestionDto } from 'src/modules/quizzes/dto/quizzes.create-question.dto';
import { QuizzesLookupDto } from 'src/modules/quizzes/dto/quizzes.lookup.dto';
import { QuizzesLookupOptionsDto } from 'src/modules/quizzes/dto/quizzes.lookup-options.dto';
import { QuizzesUpdateDto } from 'src/modules/quizzes/dto/quizzes.update.dto';

import { Question } from 'src/modules/quizzes/entities/question.entity';
import { QuestionAnswer } from 'src/modules/quizzes/entities/question-answer.entity';
import { Quiz } from 'src/modules/quizzes/entities/quiz.entity';

@Injectable()
export class QuizzesService {
  readonly orderableAttributes = ['id', 'name', 'creatorId', 'createdAt', 'updatedAt'];
  readonly loadableAttributes = [...this.orderableAttributes];
  readonly defaultOrder = 'createdAt-';
  readonly defaultInclude: Includeable[] = [
    {
      model: Question,
      required: true,
      order: 'id',
      include: [
        {
          model: QuestionAnswer,
          required: true,
          order: 'id',
        },
      ],
    },
  ];

  constructor(
    @InjectModel(Quiz) private readonly quizModel: typeof Quiz,
    @InjectModel(Question) private readonly questionModel: typeof Question,
    @InjectModel(QuestionAnswer) private readonly questionAnswerModel: typeof QuestionAnswer,
    private readonly sequelize: Sequelize,
  ) {}

  async lookup(dto: QuizzesLookupDto, transaction?: Transaction): Promise<Quiz[]> {
    const query: any = {};

    {
      const where: any = {};
      const include = dto.isRaw ? [] : this.defaultInclude;

      if (validator.isDefined(dto.ids)) {
        where.id = dto.ids;
      }

      if (validator.isDefined(dto.names)) {
        where.fullname = {
          [Op.iLike]: {
            [Op.any]: dto.names.map((item) => `%${item}%`),
          },
        };
      }

      if (validator.isDefined(dto.creatorIds)) {
        where.creatorId = dto.creatorIds;
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
            name: {
              [Op.iLike]: {
                [Op.any]: dto.search.map((item) => `%${item}%`),
              },
            },
          },
        ];
      }

      query.where = where;
      query.include = include;
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

    return this.quizModel.findAll(query);
  }

  async findOneById(id: number, options?: QuizzesLookupOptionsDto): Promise<Quiz> {
    const include = options && options.isRaw ? [] : this.defaultInclude;

    const entity = await this.quizModel.findByPk(id, {
      include,
    });

    if (!validator.isDefined(entity)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.quizModel.tableName, { id });
    }

    return entity;
  }

  async findOneByCreatorIdAndQuizId(
    creatorId: number,
    quizId: number,
    options?: QuizzesLookupOptionsDto,
  ): Promise<Quiz> {
    const include = options && options.isRaw ? [] : this.defaultInclude;

    const entity = await this.quizModel.findOne({
      where: {
        id: quizId,
        creatorId,
      },
      include,
    });

    if (!validator.isDefined(entity)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.quizModel.tableName, {
        quizId,
        creatorId,
      });
    }

    return entity;
  }

  async findAllByCreatorId(creatorId: number, options?: QuizzesLookupOptionsDto): Promise<Quiz[]> {
    return this.lookup({
      ...options,
      creatorIds: [creatorId],
    });
  }

  async findCreatorIdByQuizId(quizId: number): Promise<number> {
    const entity = await this.quizModel.findByPk(quizId, {
      attributes: ['creatorId'],
    });

    if (!validator.isDefined(entity)) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.quizModel.tableName, {
        id: quizId,
      });
    }

    return entity.creatorId;
  }

  async findCorrectAnswerOfQuestion(questionId: number): Promise<QuestionAnswer> {
    const answer = await this.questionAnswerModel.findOne({
      where: {
        questionId,
        isCorrectAnswer: true,
      },
    });

    if (!validator.isDefined(answer)) {
      throw new DatabaseError(
        DatabaseErrorType.MISSING_RECORD,
        this.questionAnswerModel.tableName,
        { questionId },
      );
    }

    return answer;
  }

  async isLastQuestion(quizId: number, questionId: number): Promise<boolean> {
    const questions = await this.questionModel.findAll({
      where: {
        quizId,
      },
      order: [['id', 'ASC']],
    });

    const lastQuestion = _.last(questions);

    return questionId === lastQuestion.id;
  }

  async create(dto: QuizzesCreateDto): Promise<Quiz> {
    await this.externalValidations(dto);

    const entity = this.quizModel.build();

    entity.name = dto.name;
    entity.creatorId = dto.creatorId;

    try {
      await this.sequelize.transaction(async (transaction) => {
        await entity.save({ transaction });

        for (const question of dto.questions) {
          const questionEntity = this.questionModel.build();

          questionEntity.quizId = entity.id;
          questionEntity.question = question.question;
          questionEntity.durationInSeconds = question.durationInSeconds;

          await questionEntity.save({ transaction });

          for (const answer of question.answers) {
            const answerEntity = this.questionAnswerModel.build();

            answerEntity.questionId = questionEntity.id;
            answerEntity.answer = answer.answer;
            answerEntity.isCorrectAnswer = answer.isCorrectAnswer;

            await answerEntity.save({ transaction });
          }
        }
      });

      return entity;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: QuizzesUpdateDto): Promise<Quiz> {
    const updates: any = {};

    if (validator.isDefined(dto.name)) {
      updates.name = dto.name;
    }

    if (validator.isDefined(dto.questions)) {
      await this.externalValidations(dto);
    }

    let entity: Quiz;
    await this.sequelize.transaction(async (transaction) => {
      if (Object.keys(updates).length > 0) {
        const result = await this.quizModel.update(updates, {
          where: { id },
          returning: true,
          transaction,
        });

        if (result[0] === 0) {
          throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.quizModel.tableName, {
            id,
          });
        }

        if (validator.isDefined(dto.questions)) {
          await this.questionModel.destroy({
            where: { quizId: id },
          });

          for (const question of dto.questions) {
            const questionEntity = this.questionModel.build();

            questionEntity.quizId = id;
            questionEntity.question = question.question;
            questionEntity.durationInSeconds = question.durationInSeconds;

            await questionEntity.save({ transaction });

            for (const answer of question.answers) {
              const answerEntity = this.questionAnswerModel.build();

              answerEntity.questionId = questionEntity.id;
              answerEntity.answer = answer.answer;
              answerEntity.isCorrectAnswer = answer.isCorrectAnswer;

              await answerEntity.save({ transaction });
            }
          }
        }
      }
    });

    return entity;
  }

  async remove(id: number): Promise<void> {
    const result = await this.quizModel.destroy({
      where: { id },
    });

    if (result === 0) {
      throw new DatabaseError(DatabaseErrorType.MISSING_RECORD, this.quizModel.tableName, { id });
    }
  }

  async externalValidations(dto: QuizzesCreateDto | QuizzesUpdateDto) {
    for (const question of dto.questions) {
      const transformedQuestion = transformer.plainToClass(QuizzesCreateQuestionDto, question);
      const errors = await validator.validate(transformedQuestion);

      if (errors.length > 0) {
        const validationErrors = errors
          .map((error) => _.map(error.constraints, (constraint) => constraint))
          .flat();
        throw new ValidationError(ValidationErrorType.INVALID_INPUT, validationErrors.join(','));
      }

      for (const answer of question.answers) {
        const transformedAnswer = transformer.plainToClass(QuizzesCreateAnswerDto, answer);
        const errors = await validator.validate(transformedAnswer);

        if (errors.length > 0) {
          const validationErrors = errors
            .map((error) => _.map(error.constraints, (constraint) => constraint))
            .flat();
          throw new ValidationError(ValidationErrorType.INVALID_INPUT, validationErrors.join(','));
        }
      }
    }
  }
}
