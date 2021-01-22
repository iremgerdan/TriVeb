import { QuestionAnswer } from "./QuestionAnswer";
import { Quiz } from "./Quiz";

export interface Question {
  id: number;
  quizId: number;
  quiz: Quiz;
  question: string;
  durationInSeconds: number;
  answers: QuestionAnswer[];
}
