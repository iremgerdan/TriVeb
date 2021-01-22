import { QuizzesCreateAnswerDto } from "./quizzes.create-answer.dto";

export interface QuizzesCreateQuestionDto {
  quizId?: number;
  question: string;
  durationInSeconds: number;
  answers: QuizzesCreateAnswerDto[];
}
