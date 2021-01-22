import { QuizzesCreateQuestionDto } from "./quizzes.create-question.dto";

export interface QuizzesCreateDto {
  name: string;
  questions: QuizzesCreateQuestionDto[];
}
