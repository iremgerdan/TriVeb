import { QuizzesCreateQuestionDto } from "./quizzes.create-question.dto";

export interface QuizzesCreateDto {
  name: string;
  creatorId?: number;
  questions: QuizzesCreateQuestionDto[];
}
