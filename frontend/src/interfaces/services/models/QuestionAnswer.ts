import { Question } from "./Question";

export interface QuestionAnswer {
  id: number;
  questionId: number;
  question: Question;
  answer: string;
  isCorrectAnswer: boolean;
}
